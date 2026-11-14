import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const addressSchema = z.object({
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal/ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export const customTextSchema = z.object({
  id: z.string(),
  text: z.string().max(100),
  fontFamily: z.string(),
  fontSize: z.number().min(10).max(80),
  color: z.string(),
  x: z.number(),
  y: z.number(),
  rotation: z.number().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
});

export const uploadedImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  x: z.number(),
  y: z.number(),
  scale: z.number(),
  rotation: z.number().optional(),
  brightness: z.number().optional(),
  contrast: z.number().optional(),
  grayscale: z.boolean().optional(),
});

export const customizationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  uploadedImages: z.array(uploadedImageSchema),
  customTexts: z.array(customTextSchema),
  designConfiguration: z.object({
    templateId: z.string().optional(),
    backgroundColor: z.string().optional(),
    backgroundPattern: z.string().optional(),
    productMockupType: z.string(),
    previewDataUrl: z.string().optional(),
  }),
  previewImage: z.string().optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50),
  selectedVariant: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }).optional(),
  customizationId: z.string().optional(),
  giftPackaging: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  customerDetails: z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
  }),
  shippingAddress: addressSchema,
  couponCode: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    customizationId: z.string().optional(),
    customization: z.object({
      previewImage: z.string().optional(),
      uploadedImagesCount: z.number().optional(),
      customTexts: z.array(z.string()).optional(),
      designConfig: z.any().optional(),
    }).optional(),
    variant: z.object({
      size: z.string().optional(),
      color: z.string().optional(),
      material: z.string().optional(),
    }).optional(),
    giftPackaging: z.boolean().optional(),
  })).min(1, 'Cart cannot be empty'),
});

export const productCreateSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  slug: z.string().min(3),
  description: z.string().min(10, 'Detailed description is required'),
  category: z.string().min(2, 'Category is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  basePrice: z.number().positive('Base price must be greater than 0'),
  discountPrice: z.number().nonnegative().optional(),
  variants: z.object({
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
  }).optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  customizationOptions: z.object({
    type: z.enum(['image', 'text', 'both']),
    maxImages: z.number().optional(),
    maxCharacters: z.number().optional(),
    allowFontSelection: z.boolean().optional(),
    allowColorSelection: z.boolean().optional(),
    allowBackgroundSelection: z.boolean().optional(),
    imagePrice: z.number().optional(),
    textPrice: z.number().optional(),
    premiumPackagingPrice: z.number().optional(),
  }),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

export const orderStatusUpdateSchema = z.object({
  orderStatus: z.enum([
    'Pending',
    'Payment Processing',
    'Confirmed',
    'Design Approved',
    'Processing',
    'Dispatched',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ]),
  trackingNumber: z.string().optional(),
  trackingCarrier: z.string().optional(),
  note: z.string().optional(),
});
