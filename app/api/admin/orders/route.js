import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
export async function GET(req) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ success: true, count: 0, orders: [] });
        }
        const query = {};
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customerDetails.name': { $regex: search, $options: 'i' } },
                { 'customerDetails.email': { $regex: search, $options: 'i' } },
                { 'customerDetails.phone': { $regex: search, $options: 'i' } },
            ];
        }
        const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();
        return NextResponse.json({ success: true, count: orders.length, orders });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Error fetching admin orders' }, { status: 500 });
    }
}
