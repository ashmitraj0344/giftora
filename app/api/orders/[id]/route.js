import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';
export async function GET(req, { params }) {
    try {
        const { id } = params;
        const db = await connectDB();
        if (db) {
            const query = mongoose.Types.ObjectId.isValid(id)
                ? { _id: id }
                : { orderNumber: id };
            const order = await Order.findOne(query).lean();
            if (order) {
                return NextResponse.json({ success: true, order });
            }
        }
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error fetching order' }, { status: 500 });
    }
}
