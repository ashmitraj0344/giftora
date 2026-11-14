import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    selectedVariant: {
      size: { type: String },
      color: { type: String },
      material: { type: String },
    },
    customizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customization' },
    giftPackaging: { type: Boolean, default: false },
  },
  { _id: true }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    guestSessionId: { type: String, index: true },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
