import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '@/lib/sample-data';
export async function POST(req) {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ error: 'Database connection failed. Please check MONGODB_URI.' }, { status: 500 });
        }
        // Seed products
        for (const p of INITIAL_PRODUCTS) {
            await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true });
        }
        // Seed coupons
        for (const c of INITIAL_COUPONS) {
            await Coupon.findOneAndUpdate({ code: c.code }, { $set: c }, { upsert: true, new: true });
        }
        // Seed Admin
        const adminPasswordHash = await hashPassword('AdminPassword123!');
        await User.findOneAndUpdate({ email: 'admin@giftora.com' }, {
            $setOnInsert: {
                name: 'Giftora Admin',
                email: 'admin@giftora.com',
                passwordHash: adminPasswordHash,
                role: 'admin',
                phone: '+91 98765 43210',
                addresses: [
                    {
                        street: '42 Prestige Heritage Towers, MG Road',
                        city: 'Bengaluru',
                        state: 'Karnataka',
                        postalCode: '560001',
                        country: 'India',
                        isDefault: true,
                    },
                ],
            },
        }, { upsert: true });
        // Seed Customer
        const customerPasswordHash = await hashPassword('Customer123!');
        await User.findOneAndUpdate({ email: 'customer@giftora.com' }, {
            $setOnInsert: {
                name: 'Aarav Sharma',
                email: 'customer@giftora.com',
                passwordHash: customerPasswordHash,
                role: 'customer',
                phone: '+91 98111 22334',
                addresses: [
                    {
                        street: '15 Lotus Boulevard, Sector 100',
                        city: 'Noida',
                        state: 'Uttar Pradesh',
                        postalCode: '201304',
                        country: 'India',
                        isDefault: true,
                    },
                ],
            },
        }, { upsert: true });
        return NextResponse.json({
            success: true,
            message: 'Database seeded with products, coupons, admin and demo customer successfully.',
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Seeding error' }, { status: 500 });
    }
}
