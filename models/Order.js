import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    customizationCharges: { type: Number, default: 0 },
    giftPackaging: { type: Boolean, default: false },
    totalItemPrice: { type: Number, required: true },
    variant: {
      size: { type: String },
      color: { type: String },
      material: { type: String },
    },
    customizationDetails: {
      uploadedImagesCount: { type: Number, default: 0 },
      customTexts: [{ type: String }],
      previewImage: { type: String },
      designConfig: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { _id: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, index: true },
      phone: { type: String, required: true },
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Payment Processing',
        'Confirmed',
        'Design Approved',
        'Processing',
        'Dispatched',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Authorized', 'Captured', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true,
    },
    paymentMethod: { type: String, default: 'UPI (YouPI-PG)' },
    upiDetails: {
      upiId: { type: String, default: 'er2ashmitraj26@ybl' },
      utrNumber: { type: String },
    },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    trackingNumber: { type: String },
    trackingCarrier: { type: String, default: 'BlueDart Express' },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    estimatedDeliveryDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
