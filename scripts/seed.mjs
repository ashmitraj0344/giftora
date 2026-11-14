import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../lib/sample-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read MONGODB_URI from process.env or .env.local
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
      if (match) MONGODB_URI = match[1];
    }
  } catch (e) {
    // ignore
  }
}

MONGODB_URI = MONGODB_URI || 'mongodb://127.0.0.1:27017/giftora';

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
  console.log('🌱 Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected successfully to database:', mongoose.connection.name);

    // 1. Seed Admin User
    const adminEmail = 'admin@giftora.com';
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Giftora Admin',
        email: adminEmail,
        passwordHash: adminHash,
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
      console.log('✅ Seeded Admin: admin@giftora.com / Admin@123');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Seed Demo Customer
    const customerEmail = 'customer@giftora.com';
    const existingCust = await User.findOne({ email: customerEmail });
    if (!existingCust) {
      const custHash = await bcrypt.hash('Customer@123', 10);
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
      console.log('✅ Seeded Customer: customer@giftora.com / Customer@123');
    } else {
      console.log('ℹ️ Customer user already exists.');
    }

    // 3. Seed Products
    console.log(`📦 Updating products collection with authentic e-commerce photography...`);
    await Product.deleteMany({});
    await Product.insertMany(INITIAL_PRODUCTS);
    console.log(`✅ Successfully updated ${INITIAL_PRODUCTS.length} products in MongoDB Atlas!`);

    // 4. Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany([
        {
          code: 'GFT10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 499,
          maxDiscount: 200,
          expiryDate: new Date('2026-12-31'),
          isActive: true,
        },
        {
          code: 'WELCOME50',
          discountType: 'fixed',
          discountValue: 50,
          minOrderValue: 299,
          expiryDate: new Date('2026-12-31'),
          isActive: true,
        },
        {
          code: 'FESTIVE20',
          discountType: 'percentage',
          discountValue: 20,
          minOrderValue: 999,
          maxDiscount: 500,
          expiryDate: new Date('2026-12-31'),
          isActive: true,
        },
      ]);
      console.log('✅ Seeded 3 active promo coupons: GFT10, WELCOME50, FESTIVE20');
    }

    console.log('🎉 MongoDB Atlas Seeding COMPLETED successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
