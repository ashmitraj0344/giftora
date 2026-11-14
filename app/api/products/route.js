import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { productCreateSchema } from '@/validations';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sort = searchParams.get('sort') || 'featured';
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const db = await connectDB();
        if (db) {
            // Auto seed if database is empty
            const count = await Product.countDocuments();
            if (count === 0) {
                await Product.insertMany(INITIAL_PRODUCTS);
            }
            const query = { isActive: true };
            if (category && category !== 'All') {
                query.category = { $regex: new RegExp(`^${category}$`, 'i') };
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                ];
            }
            let sortOptions = { createdAt: -1 };
            if (sort === 'price-low')
                sortOptions = { basePrice: 1 };
            else if (sort === 'price-high')
                sortOptions = { basePrice: -1 };
            else if (sort === 'rating')
                sortOptions = { rating: -1 };
            else if (sort === 'bestseller')
                sortOptions = { isBestseller: -1 };
            const products = await Product.find(query).sort(sortOptions).limit(limit).lean();
            return NextResponse.json({ success: true, count: products.length, products });
        }
        // Fallback if MongoDB is offline / initializing
        let filtered = [...INITIAL_PRODUCTS];
        if (category && category !== 'All') {
            filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q));
        }
        return NextResponse.json({
            success: true,
            count: filtered.length,
            products: filtered.map((p, idx) => ({ ...p, _id: p._id || `seed_${idx + 1}` })),
        });
    }
    catch (error) {
        console.error('Products GET Error:', error);
        return NextResponse.json({ error: error.message || 'Error fetching products' }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        await requireAdmin();
        const body = await req.json();
        const validation = productCreateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        await connectDB();
        const newProduct = await Product.create(validation.data);
        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}
