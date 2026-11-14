import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
export async function GET() {
    try {
        const userPayload = await getCurrentUser();
        if (!userPayload) {
            return NextResponse.json({ user: null });
        }
        const db = await connectDB();
        if (db && !userPayload.userId.includes('demo')) {
            const fullUser = await User.findById(userPayload.userId).select('-passwordHash');
            if (fullUser) {
                return NextResponse.json({
                    user: {
                        id: fullUser._id.toString(),
                        name: fullUser.name,
                        email: fullUser.email,
                        role: fullUser.role,
                        phone: fullUser.phone,
                        addresses: fullUser.addresses || [],
                    },
                });
            }
        }
        return NextResponse.json({
            user: {
                id: userPayload.userId,
                name: userPayload.name,
                email: userPayload.email,
                role: userPayload.role,
                phone: '+91 98765 43210',
                addresses: [],
            },
        });
    }
    catch (error) {
        return NextResponse.json({ user: null });
    }
}
