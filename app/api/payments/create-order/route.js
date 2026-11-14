import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Customization from '@/models/Customization';
import Coupon from '@/models/Coupon';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { calculateCustomizationPrice, calculateOrderTotals } from '@/lib/pricing';
import { createRazorpayOrder } from '@/lib/razorpay';
import { checkoutSchema } from '@/validations';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '@/lib/sample-data';
import mongoose from 'mongoose';
export async function POST(req) {
    try {
        const body = await req.json();
        const validation = checkoutSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        const { customerDetails, shippingAddress, couponCode, items } = validation.data;
        const user = await getCurrentUser();
        const db = await connectDB();
        let itemsSubtotal = 0;
        const verifiedOrderItems = [];
        // Verify each item against real product and customization data
        for (const item of items) {
            let product = null;
            if (db && mongoose.Types.ObjectId.isValid(item.productId)) {
                product = await Product.findById(item.productId);
            }
            if (!product) {
                product = INITIAL_PRODUCTS.find((p) => p.slug === item.productId || p._id === item.productId);
            }
            if (!product) {
                return NextResponse.json({ error: `Product ID "${item.productId}" is not available.` }, { status: 400 });
            }
            let customDoc = null;
            if (db && item.customizationId && mongoose.Types.ObjectId.isValid(item.customizationId)) {
                customDoc = await Customization.findById(item.customizationId);
            }
            const priceBreakdown = calculateCustomizationPrice(product, customDoc, item.giftPackaging);
            const itemTotal = priceBreakdown.itemSubtotal * item.quantity;
            itemsSubtotal += itemTotal;
            verifiedOrderItems.push({
                productId: product._id || new mongoose.Types.ObjectId(),
                productName: product.name,
                productImage: product.images[0],
                unitPrice: priceBreakdown.basePrice,
                quantity: item.quantity,
                customizationCharges: priceBreakdown.imageCharges + priceBreakdown.textCharges,
                giftPackaging: Boolean(item.giftPackaging),
                totalItemPrice: itemTotal,
                variant: item.variant,
                customizationDetails: customDoc ? {
                    uploadedImagesCount: customDoc.uploadedImages?.length || 0,
                    customTexts: customDoc.customTexts?.map((t) => t.text) || [],
                    previewImage: customDoc.previewImage,
                    designConfig: customDoc.designConfiguration,
                } : undefined,
            });
        }
        // Server-side Coupon Verification
        let discountAmount = 0;
        if (couponCode) {
            const cleanCode = couponCode.trim().toUpperCase();
            let coupon = null;
            if (db) {
                coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
            }
            if (!coupon) {
                coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.isActive);
            }
            if (coupon && (!coupon.minOrderValue || itemsSubtotal >= coupon.minOrderValue)) {
                if (coupon.discountType === 'percentage') {
                    discountAmount = (itemsSubtotal * coupon.discountValue) / 100;
                    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                        discountAmount = coupon.maxDiscount;
                    }
                }
                else {
                    discountAmount = coupon.discountValue;
                }
                discountAmount = Math.min(itemsSubtotal, Math.round(discountAmount));
            }
        }
        const { subtotal, discount, shippingCharge, totalAmount } = calculateOrderTotals({
            itemsTotal: itemsSubtotal,
            discountAmount,
        });
        const orderNumber = `GFT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        // Create server-side Razorpay order
        const razorpayOrder = await createRazorpayOrder({
            amountInRupees: totalAmount,
            receipt: orderNumber,
            notes: {
                customerEmail: customerDetails.email,
                customerName: customerDetails.name,
            },
        });
        let newOrder = null;
        if (db) {
            newOrder = await Order.create({
                orderNumber,
                userId: user ? user.userId : undefined,
                customerDetails,
                orderItems: verifiedOrderItems,
                shippingAddress,
                subtotal,
                shippingCharge,
                discount,
                couponCode: couponCode || undefined,
                totalAmount,
                orderStatus: 'Payment Processing',
                paymentStatus: 'Pending',
                paymentMethod: 'Razorpay',
                razorpayOrderId: razorpayOrder.id,
                statusHistory: [
                    {
                        status: 'Pending',
                        timestamp: new Date(),
                        note: 'Order initiated, awaiting payment verification.',
                    },
                ],
                estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days delivery
            });
        }
        return NextResponse.json({
            success: true,
            orderNumber,
            orderId: newOrder ? newOrder._id.toString() : orderNumber,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_giftora_demo_key',
            mockMode: razorpayOrder.mockMode,
            summary: {
                subtotal,
                discount,
                shippingCharge,
                totalAmount,
            },
        });
    }
    catch (error) {
        console.error('Create Payment Order Error:', error);
        return NextResponse.json({ error: error.message || 'Error creating payment order' }, { status: 500 });
    }
}
