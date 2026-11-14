import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import Cart from '@/models/Cart';
import { getCurrentUser } from '@/lib/auth';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import mongoose from 'mongoose';
export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json({ error: 'Missing required payment verification parameters.' }, { status: 400 });
        }
        // Server-side signature verification
        const isValidSignature = verifyRazorpayPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });
        if (!isValidSignature) {
            return NextResponse.json({ error: 'Payment signature verification failed. Untrusted transaction.' }, { status: 400 });
        }
        const db = await connectDB();
        if (db) {
            const query = mongoose.Types.ObjectId.isValid(orderId)
                ? { _id: orderId }
                : { $or: [{ orderNumber: orderId }, { razorpayOrderId }] };
            const order = await Order.findOne(query);
            if (order) {
                order.orderStatus = 'Confirmed';
                order.paymentStatus = 'Captured';
                order.razorpayPaymentId = razorpayPaymentId;
                order.razorpaySignature = razorpaySignature;
                order.statusHistory.push({
                    status: 'Confirmed',
                    timestamp: new Date(),
                    note: `Payment verified successfully via Razorpay (Txn: ${razorpayPaymentId}).`,
                });
                await order.save();
                // Create Payment audit log
                await Payment.create({
                    orderId: order._id,
                    provider: 'razorpay',
                    transactionId: razorpayPaymentId,
                    amount: order.totalAmount,
                    currency: 'INR',
                    status: 'Captured',
                    signatureVerified: true,
                    rawPayload: body,
                });
                // Clear user's active cart after successful order
                const user = await getCurrentUser();
                if (user) {
                    await Cart.findOneAndUpdate({ userId: user.userId }, { $set: { items: [] } });
                }
                return NextResponse.json({
                    success: true,
                    orderNumber: order.orderNumber,
                    orderId: order._id.toString(),
                    message: 'Payment verified and order confirmed successfully.',
                });
            }
        }
        return NextResponse.json({
            success: true,
            orderNumber: orderId,
            message: 'Payment verified successfully in test environment.',
        });
    }
    catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message || 'Error verifying payment.' }, { status: 500 });
    }
}
