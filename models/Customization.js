import mongoose from 'mongoose';

const CustomizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    uploadedImages: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
        x: { type: Number, default: 50 },
        y: { type: Number, default: 50 },
        scale: { type: Number, default: 1 },
        rotation: { type: Number, default: 0 },
        brightness: { type: Number, default: 100 },
        contrast: { type: Number, default: 100 },
        grayscale: { type: Boolean, default: false },
      },
    ],
    customTexts: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        fontFamily: { type: String, default: 'Playfair Display' },
        fontSize: { type: Number, default: 24 },
        color: { type: String, default: '#702C3B' },
        x: { type: Number, default: 50 },
        y: { type: Number, default: 80 },
        rotation: { type: Number, default: 0 },
        fontWeight: { type: String, default: '600' },
        textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
      },
    ],
    designConfiguration: {
      templateId: { type: String },
      backgroundColor: { type: String, default: '#FFFFFF' },
      backgroundPattern: { type: String, default: 'none' },
      productMockupType: { type: String, default: 'generic' },
      previewDataUrl: { type: String },
    },
    previewImage: { type: String },
    calculatedPrice: {
      basePrice: { type: Number, required: true },
      imageCharges: { type: Number, default: 0 },
      textCharges: { type: Number, default: 0 },
      packagingCharges: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customization ||
  mongoose.model('Customization', CustomizationSchema);
