import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
export const maxDuration = 30; // 30 seconds max for uploads
export async function POST(req) {
    try {
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            const { image, folder } = body;
            if (!image) {
                return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
            }
            const uploadResult = await uploadImage(image, folder || 'giftora_customizations');
            return NextResponse.json({ success: true, ...uploadResult });
        }
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file');
            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
            }
            // Check mime type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json({ error: 'Invalid file type. Supported formats: JPG, PNG, WebP.' }, { status: 400 });
            }
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
            const uploadResult = await uploadImage(base64Data, 'giftora_customizations');
            return NextResponse.json({ success: true, ...uploadResult });
        }
        return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
    }
    catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
    }
}
