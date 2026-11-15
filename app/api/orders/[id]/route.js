import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const cleanId = decodeURIComponent(rawId).trim();

    const db = await connectDB();
    if (db) {
      let query;
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        query = { _id: cleanId };
      } else {
        const escaped = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query = {
          $or: [
            { orderNumber: { $regex: new RegExp(`^${escaped}$`, 'i') } },
            { trackingNumber: { $regex: new RegExp(`^${escaped}$`, 'i') } },
            { 'customerDetails.email': { $regex: new RegExp(`^${escaped}$`, 'i') } },
            { 'customerDetails.phone': { $regex: new RegExp(`^${escaped}$`, 'i') } },
          ],
        };
      }

      const order = await Order.findOne(query).sort({ createdAt: -1 }).lean();
      if (order) {
        return NextResponse.json({ success: true, order });
      }
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Track order GET error:', error);
    return NextResponse.json({ error: error.message || 'Error fetching order' }, { status: 500 });
  }
}
