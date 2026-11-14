import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';
import { getCurrentUser } from '@/lib/auth';
import { addToCartSchema } from '@/validations';
import { calculateCustomizationPrice, calculateOrderTotals } from '@/lib/pricing';
import mongoose from 'mongoose';
export async function GET(req) {
    try {
        const user = await getCurrentUser();
        const guestId = req.headers.get('x-guest-session') || 'default_guest';
        const db = await connectDB();
        if (db) {
            let cart = null;
            if (user) {
                cart = await Cart.findOne({ userId: user.userId })
                    .populate('items.productId')
                    .populate('items.customizationId');
            }
            else {
                cart = await Cart.findOne({ guestSessionId: guestId })
                    .populate('items.productId')
                    .populate('items.customizationId');
            }
            if (cart) {
                let itemsTotal = 0;
                const formattedItems = cart.items.map((item) => {
                    const product = item.productId;
                    const custom = item.customizationId;
                    const breakdown = calculateCustomizationPrice(product, custom, item.giftPackaging);
                    const lineTotal = breakdown.itemSubtotal * item.quantity;
                    itemsTotal += lineTotal;
                    return {
                        _id: item._id.toString(),
                        productId: product._id.toString(),
                        product: {
                            _id: product._id.toString(),
                            name: product.name,
                            slug: product.slug,
                            images: product.images,
                            basePrice: product.basePrice,
                            discountPrice: product.discountPrice,
                            stock: product.stock,
                        },
                        quantity: item.quantity,
                        selectedVariant: item.selectedVariant,
                        customizationId: custom ? custom._id.toString() : undefined,
                        customization: custom ? {
                            previewImage: custom.previewImage,
                            uploadedImagesCount: custom.uploadedImages?.length || 0,
                            customTexts: custom.customTexts?.map((t) => t.text) || [],
                        } : null,
                        itemPrice: breakdown.basePrice,
                        customizationCharges: breakdown.imageCharges + breakdown.textCharges + breakdown.packagingCharges,
                        giftPackaging: item.giftPackaging,
                        lineTotal,
                    };
                });
                const totals = calculateOrderTotals({ itemsTotal });
                return NextResponse.json({
                    success: true,
                    cart: {
                        items: formattedItems,
                        couponCode: cart.couponCode,
                        ...totals,
                    },
                });
            }
        }
        return NextResponse.json({
            success: true,
            cart: {
                items: [],
                subtotal: 0,
                discount: 0,
                shippingCharge: 0,
                totalAmount: 0,
            },
        });
    }
    catch (error) {
        console.error('Cart GET Error:', error);
        return NextResponse.json({ error: error.message || 'Error fetching cart' }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const body = await req.json();
        const validation = addToCartSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        const { productId, quantity, selectedVariant, customizationId, giftPackaging } = validation.data;
        const user = await getCurrentUser();
        const guestId = req.headers.get('x-guest-session') || 'default_guest';
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ success: true, message: 'Added to cart in offline test mode.' });
        }
        let cartQuery = user ? { userId: user.userId } : { guestSessionId: guestId };
        let cart = await Cart.findOne(cartQuery);
        if (!cart) {
            cart = new Cart({
                userId: user ? user.userId : undefined,
                guestSessionId: user ? undefined : guestId,
                items: [],
            });
        }
        // Check if duplicate item (matching product, custom, and variant)
        const existingIndex = cart.items.findIndex((item) => {
            const sameProduct = item.productId.toString() === productId;
            const sameCustom = String(item.customizationId || '') === String(customizationId || '');
            const sameSize = (item.selectedVariant?.size || '') === (selectedVariant?.size || '');
            const sameColor = (item.selectedVariant?.color || '') === (selectedVariant?.color || '');
            return sameProduct && sameCustom && sameSize && sameColor;
        });
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        }
        else {
            cart.items.push({
                productId: new mongoose.Types.ObjectId(productId),
                quantity,
                selectedVariant,
                customizationId: customizationId ? new mongoose.Types.ObjectId(customizationId) : undefined,
                giftPackaging: Boolean(giftPackaging),
            });
        }
        await cart.save();
        return NextResponse.json({ success: true, cart });
    }
    catch (error) {
        console.error('Add To Cart Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to add item to cart' }, { status: 500 });
    }
}
