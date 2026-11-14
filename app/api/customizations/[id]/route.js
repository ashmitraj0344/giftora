import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Customization from '@/models/Customization';
import mongoose from 'mongoose';
export async function GET(req, { params }) {
    try {
        const { id } = params;
        const db = await connectDB();
        if (db && mongoose.Types.ObjectId.isValid(id)) {
            const customization = await Customization.findById(id).populate('productId');
            if (customization) {
                return NextResponse.json({ success: true, customization });
            }
        }
        return NextResponse.json({ error: 'Customization configuration not found.' }, { status: 404 });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Error fetching customization' }, { status: 500 });
    }
}
