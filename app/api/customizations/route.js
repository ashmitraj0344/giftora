import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Customization from '@/models/Customization';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';
import { calculateCustomizationPrice } from '@/lib/pricing';
import { customizationSchema } from '@/validations';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import mongoose from 'mongoose';
export async function POST(req) {
    try {
        const body = await req.json();
        const validation = customizationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        const { productId, uploadedImages, customTexts, designConfiguration, previewImage } = validation.data;
        const user = await getCurrentUser();
        const db = await connectDB();
        let product = null;
        if (db && mongoose.Types.ObjectId.isValid(productId)) {
            product = await Product.findById(productId);
        }
        // Fallback to initial products if offline or seeded ID
        if (!product) {
            product = INITIAL_PRODUCTS.find((p) => p.slug === productId || p._id === productId);
        }
        if (!product) {
            return NextResponse.json({ error: 'Referenced product not found.' }, { status: 404 });
        }
        // Server-side calculated price breakdown (Rule 7: Never trust client price)
        const priceBreakdown = calculateCustomizationPrice(product, {
            uploadedImages: uploadedImages,
            customTexts: customTexts,
        });
        if (db) {
            const customization = await Customization.create({
                userId: user ? user.userId : undefined,
                productId: product._id,
                uploadedImages,
                customTexts,
                designConfiguration,
                previewImage: previewImage || designConfiguration.previewDataUrl,
                calculatedPrice: {
                    basePrice: priceBreakdown.basePrice,
                    imageCharges: priceBreakdown.imageCharges,
                    textCharges: priceBreakdown.textCharges,
                    packagingCharges: priceBreakdown.packagingCharges,
                    total: priceBreakdown.itemSubtotal,
                },
            });
            return NextResponse.json({
                success: true,
                customizationId: customization._id.toString(),
                calculatedPrice: customization.calculatedPrice,
            });
        }
        // Fallback in-memory response
        const mockId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        return NextResponse.json({
            success: true,
            customizationId: mockId,
            calculatedPrice: {
                basePrice: priceBreakdown.basePrice,
                imageCharges: priceBreakdown.imageCharges,
                textCharges: priceBreakdown.textCharges,
                packagingCharges: priceBreakdown.packagingCharges,
                total: priceBreakdown.itemSubtotal,
            },
        });
    }
    catch (error) {
        console.error('Customization Save Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to persist customization.' }, { status: 500 });
    }
}
