import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
import { orderStatusUpdateSchema } from '@/validations';
import mongoose from 'mongoose';
export async function PUT(req, { params }) {
    try {
        await requireAdmin();
        const { id } = params;
        const body = await req.json();
        const validation = orderStatusUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        const { orderStatus, trackingNumber, trackingCarrier, note } = validation.data;
        await connectDB();
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
        const order = await Order.findOne(query);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        order.orderStatus = orderStatus;
        if (trackingNumber)
            order.trackingNumber = trackingNumber;
        if (trackingCarrier)
            order.trackingCarrier = trackingCarrier;
        order.statusHistory.push({
            status: orderStatus,
            timestamp: new Date(),
            note: note || `Order status updated to ${orderStatus}`,
        });
        await order.save();
        return NextResponse.json({ success: true, order });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Error updating order' }, { status: 500 });
    }
}
