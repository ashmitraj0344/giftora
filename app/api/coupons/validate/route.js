import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';
import { INITIAL_COUPONS } from '@/lib/sample-data';
export async function POST(req) {
    try {
        const { code, orderAmount } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }
        const cleanCode = code.trim().toUpperCase();
        const db = await connectDB();
        let coupon = null;
        if (db) {
            coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
        }
        if (!coupon) {
            coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.isActive);
        }
        if (!coupon) {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
        }
        const amount = Number(orderAmount) || 0;
        if (coupon.minOrderValue && amount < coupon.minOrderValue) {
            return NextResponse.json({ error: `Minimum order value of ₹${coupon.minOrderValue} required for this code.` }, { status: 400 });
        }
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }
        else {
            discount = coupon.discountValue;
        }
        discount = Math.min(amount, Math.round(discount));
        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: discount,
            },
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error validating coupon' }, { status: 500 });
    }
}
