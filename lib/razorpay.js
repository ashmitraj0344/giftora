import crypto from 'crypto';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || '';
const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
const webhook_secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export const isRazorpayConfigured = Boolean(
  key_id &&
  key_secret &&
  !key_id.includes('demo') &&
  !key_id.includes('your_')
);

export const razorpayClient = isRazorpayConfigured
  ? new Razorpay({
      key_id,
      key_secret,
    })
  : null;

/**
 * Creates a server-side order with Razorpay in INR.
 * Falls back cleanly to safe mock test mode if test credentials aren't active yet.
 */
export async function createRazorpayOrder({
  amountInRupees,
  receipt,
  notes = {},
}) {
  const amountInPaise = Math.round(amountInRupees * 100);

  if (razorpayClient) {
    try {
      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes,
      });

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        status: order.status,
        mockMode: false,
      };
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error?.message || error);
      throw new Error(`Razorpay Error: ${error?.message || 'Could not initiate payment'}`);
    }
  }

  // Safe developer test simulation mode
  const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency: 'INR',
    status: 'created',
    mockMode: true,
  };
}

/**
 * Validates Razorpay signature on server.
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}) {
  if (!isRazorpayConfigured || orderId.startsWith('order_test_')) {
    return signature.startsWith('mock_sig_') || signature.length > 10;
  }

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Validates Razorpay Webhook signature
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
}) {
  if (!webhook_secret) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhook_secret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}
