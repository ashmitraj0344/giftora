import { v2 as cloudinary } from 'cloudinary';

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(
  cloud_name &&
  api_key &&
  api_secret &&
  !cloud_name.includes('demo') &&
  cloud_name !== ''
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

/**
 * Uploads an image base64 data URL or buffer to Cloudinary or falls back to data URI
 */
export async function uploadImage(fileDataUri, folder = 'giftora_customizations') {
  if (isCloudinaryConfigured) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      return {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      };
    } catch (error) {
      console.warn('Cloudinary upload fallback to inline storage:', error?.message);
    }
  }

  // Fallback: return data URI for seamless local testing without third-party account requirement
  return {
    url: fileDataUri,
    publicId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
}
