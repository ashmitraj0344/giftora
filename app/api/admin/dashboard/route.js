import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
    try {
        await requireAdmin();
        const db = await connectDB();
        if (!db) {
            // In-memory demo dashboard data
            return NextResponse.json({
                success: true,
                stats: {
                    totalRevenue: 284500,
                    totalOrders: 142,
                    totalCustomers: 89,
                    totalProducts: 24,
                    pendingOrders: 12,
                    deliveredOrders: 118,
                    lowStockProducts: 3,
                },
                monthlyRevenue: [
                    { month: 'Jun', revenue: 24000, orders: 15 },
                    { month: 'Jul', revenue: 38000, orders: 22 },
                    { month: 'Aug', revenue: 42000, orders: 25 },
                    { month: 'Sep', revenue: 51000, orders: 31 },
                    { month: 'Oct', revenue: 64000, orders: 38 },
                    { month: 'Nov', revenue: 65500, orders: 41 },
                ],
                salesByCategory: [
                    { category: 'Photo Frames', count: 42, value: 31458 },
                    { category: 'Customized Mugs', count: 58, value: 17342 },
                    { category: 'LED Photo Lamps', count: 28, value: 25172 },
                    { category: 'Photo Albums', count: 14, value: 18186 },
                ],
                recentOrders: [],
            });
        }
        const [totalOrders, totalCustomers, totalProducts, pendingOrders, deliveredOrders, lowStockProducts, recentOrders, revenueResult,] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Product.countDocuments({ isActive: true }),
            Order.countDocuments({ orderStatus: { $in: ['Pending', 'Payment Processing', 'Confirmed', 'Processing'] } }),
            Order.countDocuments({ orderStatus: 'Delivered' }),
            Product.countDocuments({ stock: { $lte: 10 } }),
            Order.find().sort({ createdAt: -1 }).limit(10).lean(),
            Order.aggregate([
                { $match: { paymentStatus: 'Captured' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;
        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                totalProducts,
                pendingOrders,
                deliveredOrders,
                lowStockProducts,
            },
            recentOrders,
        });
    }
    catch (error) {
        if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.json({ error: error.message || 'Dashboard error' }, { status: 500 });
    }
}
