/**
 * Calculates item price breakdown strictly from verified product configuration and customization inputs.
 */
export function calculateCustomizationPrice(product, customization = null, giftPackaging = false) {
  const basePrice = product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice > 0
    ? product.discountPrice
    : product.basePrice;

  const imagePricePerUnit = product.customizationOptions?.imagePrice ?? 50;
  const textPricePerUnit = product.customizationOptions?.textPrice ?? 20;
  const packagingPrice = product.customizationOptions?.premiumPackagingPrice ?? 40;

  const imagesCount = customization?.uploadedImages?.length || 0;
  const textsCount = customization?.customTexts?.length || 0;

  const imageCharges = imagesCount > 0 ? imagesCount * imagePricePerUnit : 0;
  const textCharges = textsCount > 0 ? textsCount * textPricePerUnit : 0;
  const packagingCharges = giftPackaging ? packagingPrice : 0;

  const itemSubtotal = basePrice + imageCharges + textCharges + packagingCharges;

  return {
    basePrice,
    imageCharges,
    textCharges,
    packagingCharges,
    itemSubtotal,
  };
}

/**
 * Calculates cart / order totals with shipping & discounts applied safely on server.
 */
export function calculateOrderTotals({
  itemsTotal,
  discountAmount = 0,
  freeShippingThreshold = 999,
  standardShippingFee = 79,
}) {
  const subtotal = Math.max(0, itemsTotal);
  const validatedDiscount = Math.min(subtotal, Math.max(0, discountAmount));
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : standardShippingFee;
  const totalAmount = Math.max(0, subtotal - validatedDiscount + shippingCharge);

  return {
    subtotal,
    discount: validatedDiscount,
    shippingCharge,
    totalAmount,
  };
}
