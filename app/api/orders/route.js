import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const orderNumber = searchParams.get('orderNumber');
    const emailParam = searchParams.get('email');

    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, count: 0, orders: [] });
    }

    let query = null;

    if (orderNumber) {
      query = { orderNumber };
    } else if (user) {
      const cleanEmail = (user.email || '').toLowerCase().trim();
      query = user.role === 'admin' && searchParams.get('all') === 'true'
        ? {}
        : {
            $or: [
              { userId: user.userId },
              { 'customerDetails.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } },
            ],
          };
    } else if (emailParam) {
      query = { 'customerDetails.email': { $regex: new RegExp(`^${emailParam.toLowerCase().trim()}$`, 'i') } };
    } else {
      // Unauthenticated, return empty list gracefully
      return NextResponse.json({ success: true, count: 0, orders: [], requiresAuth: true });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ error: error.message || 'Error fetching orders' }, { status: 500 });
  }
}
