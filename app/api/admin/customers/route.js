import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
    try {
        await requireAdmin();
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ success: true, count: 0, customers: [] });
        }
        const customers = await User.find({ role: 'customer' })
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .lean();
        // Enrich with order statistics
        const enriched = await Promise.all(customers.map(async (cust) => {
            const orderCount = await Order.countDocuments({
                $or: [{ userId: cust._id }, { 'customerDetails.email': cust.email }],
            });
            return {
                ...cust,
                orderCount,
            };
        }));
        return NextResponse.json({ success: true, count: enriched.length, customers: enriched });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Error fetching customers' }, { status: 500 });
    }
}
