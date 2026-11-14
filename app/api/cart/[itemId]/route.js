import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';
import { getCurrentUser } from '@/lib/auth';
export async function PUT(req, { params }) {
    try {
        const { itemId } = params;
        const body = await req.json();
        const { quantity } = body;
        const user = await getCurrentUser();
        const guestId = req.headers.get('x-guest-session') || 'default_guest';
        await connectDB();
        const cartQuery = user ? { userId: user.userId } : { guestSessionId: guestId };
        const cart = await Cart.findOne(cartQuery);
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }
        const item = cart.items.id(itemId);
        if (!item) {
            return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
        }
        if (quantity <= 0) {
            cart.items.pull(itemId);
        }
        else {
            item.quantity = Math.min(50, quantity);
        }
        await cart.save();
        return NextResponse.json({ success: true, message: 'Cart updated successfully' });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error updating cart item' }, { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        const { itemId } = params;
        const user = await getCurrentUser();
        const guestId = req.headers.get('x-guest-session') || 'default_guest';
        await connectDB();
        const cartQuery = user ? { userId: user.userId } : { guestSessionId: guestId };
        const cart = await Cart.findOne(cartQuery);
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }
        cart.items.pull(itemId);
        await cart.save();
        return NextResponse.json({ success: true, message: 'Item removed from cart' });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error removing item from cart' }, { status: 500 });
    }
}
