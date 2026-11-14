import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import { registerSchema } from '@/validations';
export async function POST(req) {
    try {
        const body = await req.json();
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }
        const { name, email, password, phone } = validation.data;
        await connectDB();
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 409 });
        }
        const passwordHash = await hashPassword(password);
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: 'customer',
            phone: phone || '',
            addresses: [],
            wishlist: [],
        });
        const token = await signToken({
            userId: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        });
        const response = NextResponse.json({
            success: true,
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
        response.cookies.set('giftora_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return response;
    }
    catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error during registration.' }, { status: 500 });
    }
}
