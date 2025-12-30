// src/products/vayu/utils/pricing.js

// Central product definition for Vayu order / checkout
export const VAYU_PRODUCT = {
  id: "vayu-ai-glasses",
  name: "Vayu AI Glasses",
  shortDescription: "Glasses that answer what matters.",
  images: [
    `${process.env.PUBLIC_URL || ''}/vayu/hero.webp`,
    `${process.env.PUBLIC_URL || ''}/vayu/ai-main.png`,
    `${process.env.PUBLIC_URL || ''}/vayu/meeting.png`,
    `${process.env.PUBLIC_URL || ''}/vayu/privacy.jpg`,
  ],
  basePrice: 59999, // INR - Non-prescription base price
  compareAtPrice: 69999, // Default compare-at for non-prescription
  variants: [
    {
      id: "non-prescription",
      label: "Non-prescription",
      helper: "Clear lenses, ready to wear out of the box.",
      priceDelta: 0, // Base price: ₹59,999
      compareAtPrice: 69999, // Shown as ₹69,999 → ₹59,999
    },
    {
      id: "prescription",
      label: "Prescription",
      helper: "We'll contact you via email after checkout to collect your prescription details securely.",
      priceDelta: 5000, // Additional ₹5,000 for prescription = ₹64,999 total
      compareAtPrice: 74999, // Shown as ₹74,999 → ₹64,999
    },
  ],
  shippingNote:
    "Orders start shipping in March 2026. 6-month warranty included.",
};

export function getVariantById(variantId) {
  return VAYU_PRODUCT.variants.find((v) => v.id === variantId) || VAYU_PRODUCT.variants[0];
}

export function getUnitPrice(variantId) {
  const variant = getVariantById(variantId);
  return VAYU_PRODUCT.basePrice + (variant?.priceDelta || 0);
}

export function calculateLineTotal(variantId, quantity) {
  const unit = getUnitPrice(variantId);
  return unit * Math.max(1, quantity || 1);
}

export function getCompareAtPrice(variantId) {
  const variant = getVariantById(variantId);
  return variant?.compareAtPrice || VAYU_PRODUCT.compareAtPrice || null;
}

export function applyCoupon({ subtotal, couponCode }) {
  if (!couponCode) {
    return { discount: 0, finalTotal: subtotal };
  }

  const normalized = couponCode.trim().toUpperCase();

  // Simple demo coupons
  if (normalized === "LAUNCH2025") {
    const discount = Math.round(subtotal * 0.1); // 10% off
    return { discount, finalTotal: subtotal - discount };
  }

  if (normalized === "VAYU5000") {
    const discount = 5000;
    return { discount, finalTotal: Math.max(0, subtotal - discount) };
  }

  // Unknown code
  return { discount: 0, finalTotal: subtotal };
}


