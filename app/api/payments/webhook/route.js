import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import { verifyWebhookSignature } from '@/lib/razorpay';
export async function POST(req) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        if (!signature) {
            return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
        }
        const isValid = verifyWebhookSignature({ rawBody, signature });
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }
        const payload = JSON.parse(rawBody);
        const event = payload.event;
        await connectDB();
        if (event === 'payment.captured' || event === 'order.paid') {
            const paymentEntity = payload.payload.payment.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const paymentId = paymentEntity.id;
            // Idempotent check
            const existingPayment = await Payment.findOne({ transactionId: paymentId });
            if (existingPayment) {
                return NextResponse.json({ status: 'ok', message: 'Already processed' });
            }
            const order = await Order.findOne({ razorpayOrderId });
            if (order) {
                if (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Shipped') {
                    order.orderStatus = 'Confirmed';
                }
                order.paymentStatus = 'Captured';
                order.razorpayPaymentId = paymentId;
                order.statusHistory.push({
                    status: 'Confirmed',
                    timestamp: new Date(),
                    note: `Payment confirmed via webhook (${paymentId}).`,
                });
                await order.save();
                await Payment.create({
                    orderId: order._id,
                    provider: 'razorpay',
                    transactionId: paymentId,
                    amount: paymentEntity.amount / 100,
                    currency: paymentEntity.currency,
                    status: 'Captured',
                    signatureVerified: true,
                    rawPayload: payload,
                });
            }
        }
        else if (event === 'payment.failed') {
            const paymentEntity = payload.payload.payment.entity;
            const razorpayOrderId = paymentEntity.order_id;
            const order = await Order.findOne({ razorpayOrderId });
            if (order) {
                order.paymentStatus = 'Failed';
                order.statusHistory.push({
                    status: 'Payment Failed',
                    timestamp: new Date(),
                    note: `Payment failed: ${paymentEntity.error_description || 'Transaction unsuccessful'}`,
                });
                await order.save();
            }
        }
        return NextResponse.json({ status: 'ok' });
    }
    catch (error) {
        console.error('Razorpay Webhook Error:', error);
        return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 500 });
    }
}
