import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import mongoose from 'mongoose';
export async function GET(req, { params }) {
    try {
        const { slug } = params;
        const db = await connectDB();
        if (db) {
            let product = null;
            if (mongoose.Types.ObjectId.isValid(slug)) {
                product = await Product.findById(slug).lean();
            }
            if (!product) {
                product = await Product.findOne({ slug }).lean();
            }
            if (product) {
                return NextResponse.json({ success: true, product });
            }
        }
        // Fallback to sample data
        const matched = INITIAL_PRODUCTS.find((p) => p.slug === slug || p.name.toLowerCase().replace(/\s+/g, '-') === slug);
        if (!matched) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            product: { ...matched, _id: matched._id || 'mock_prod_1' },
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error fetching product' }, { status: 500 });
    }
}
export async function PUT(req, { params }) {
    try {
        await requireAdmin();
        const { slug } = params;
        const body = await req.json();
        await connectDB();
        const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug };
        const updated = await Product.findOneAndUpdate(query, body, { new: true });
        if (!updated) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, product: updated });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        await requireAdmin();
        const { slug } = params;
        await connectDB();
        const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug };
        const deleted = await Product.findOneAndDelete(query);
        if (!deleted) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
    }
}
