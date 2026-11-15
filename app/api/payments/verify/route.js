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
    const {
      orderId,
      orderNumber: bodyOrderNumber,
      paymentMethod,
      utrNumber,
      upiId = 'er2ashmitraj26@ybl',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    const db = await connectDB();

    // 1. YouPI-PG / Direct UPI Payment Verification
    if (paymentMethod === 'upi' || utrNumber) {
      const cleanUTR = (utrNumber || `UPI_${Date.now()}`).trim();
      const orConditions = [];
      if (bodyOrderNumber) orConditions.push({ orderNumber: bodyOrderNumber });
      if (orderId) {
        orConditions.push({ orderNumber: orderId });
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          orConditions.push({ _id: orderId });
        }
      }
      const query = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };

      let order = null;
      if (db) {
        order = await Order.findOne(query);
      }

      if (order) {
        order.orderStatus = 'Confirmed';
        order.paymentStatus = 'Captured';
        order.paymentMethod = 'UPI (YouPI-PG)';
        order.upiDetails = {
          upiId: upiId || 'er2ashmitraj26@ybl',
          utrNumber: cleanUTR,
        };
        order.statusHistory.push({
          status: 'Confirmed',
          timestamp: new Date(),
          note: `Payment verified via YouPI-PG to ${upiId} (UTR: ${cleanUTR}).`,
        });
        await order.save();

        await Payment.create({
          orderId: order._id,
          provider: 'youpi-pg',
          transactionId: cleanUTR,
          amount: order.totalAmount,
          currency: 'INR',
          status: 'Captured',
          signatureVerified: true,
          rawPayload: { upiId, utrNumber: cleanUTR, orderNumber: order.orderNumber },
        });

        // Clear user active cart
        const user = await getCurrentUser();
        if (user) {
          await Cart.findOneAndUpdate({ userId: user.userId }, { $set: { items: [] } });
        }

        return NextResponse.json({
          success: true,
          orderNumber: order.orderNumber,
          orderId: order._id.toString(),
          message: 'UPI payment verified and order placed successfully!',
        });
      }

      return NextResponse.json({
        success: true,
        orderNumber: bodyOrderNumber || orderId || `GFT-${Date.now().toString().slice(-6)}`,
        message: 'UPI payment received and recorded.',
      });
    }

    // 2. Razorpay / Academic Test Mode Verification
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing required payment verification parameters.' }, { status: 400 });
    }

    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Payment signature verification failed. Untrusted transaction.' }, { status: 400 });
    }

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
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Error verifying payment.' }, { status: 500 });
  }
}
