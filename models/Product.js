import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String, required: true }],
    basePrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    variants: {
      sizes: [{ type: String }],
      colors: [{ type: String }],
      materials: [{ type: String }],
    },
    material: { type: String },
    customizationOptions: {
      type: { type: String, enum: ['image', 'text', 'both'], default: 'both' },
      maxImages: { type: Number, default: 3 },
      maxCharacters: { type: Number, default: 60 },
      allowFontSelection: { type: Boolean, default: true },
      allowColorSelection: { type: Boolean, default: true },
      allowBackgroundSelection: { type: Boolean, default: true },
      imagePrice: { type: Number, default: 50 },
      textPrice: { type: Number, default: 20 },
      premiumPackagingPrice: { type: Number, default: 40 },
    },
    mockupType: {
      type: String,
      enum: ['mug', 'frame', 'tshirt', 'cushion', 'lamp', 'keychain', 'album', 'watch', 'generic'],
      default: 'generic',
    },
    stock: { type: Number, required: true, default: 50, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 24 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
