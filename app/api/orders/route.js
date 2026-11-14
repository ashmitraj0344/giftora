import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
export async function GET(req) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Please log in to view your orders.' }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const db = await connectDB();
        if (db) {
            const query = user.role === 'admin' && searchParams.get('all') === 'true'
                ? {}
                : { $or: [{ userId: user.userId }, { 'customerDetails.email': user.email }] };
            const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();
            return NextResponse.json({ success: true, count: orders.length, orders });
        }
        return NextResponse.json({ success: true, count: 0, orders: [] });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error fetching orders' }, { status: 500 });
    }
}
