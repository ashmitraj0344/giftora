import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/giftora';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  addresses: Array,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [String],
  basePrice: { type: Number, required: true },
  discountPrice: Number,
  variants: Object,
  material: String,
  customizationOptions: Object,
  mockupType: String,
  stock: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 24 },
}, { timestamps: true });

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'] },
  discountValue: Number,
  minOrderValue: Number,
  maxDiscount: Number,
  expiryDate: Date,
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

async function seed() {
  console.log('🌱 Connecting to MongoDB:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // Seed Admin User
    const adminEmail = 'admin@giftora.com';
    const adminPassword = 'AdminPassword123!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Giftora Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        phone: '+91 98765 43210',
        addresses: [
          {
            street: '42 Prestige Heritage Towers, MG Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India',
            isDefault: true,
          },
        ],
      });
      console.log('✅ Created Admin user: admin@giftora.com / AdminPassword123!');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // Seed Demo Customer
    const customerEmail = 'customer@giftora.com';
    const existingCust = await User.findOne({ email: customerEmail });
    if (!existingCust) {
      const custHash = await bcrypt.hash('Customer123!', 10);
      await User.create({
        name: 'Aarav Sharma',
        email: customerEmail,
        passwordHash: custHash,
        role: 'customer',
        phone: '+91 98111 22334',
        addresses: [
          {
            street: '15 Lotus Boulevard, Sector 100',
            city: 'Noida',
            state: 'Uttar Pradesh',
            postalCode: '201304',
            country: 'India',
            isDefault: true,
          },
        ],
      });
      console.log('✅ Created Demo Customer: customer@giftora.com / Customer123!');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
