// src/products/vayu/utils/validators.js

// Basic email validation
export function isValidEmail(value) {
  if (!value) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}

// India-focused phone validation (allows +91, spaces, dashes)
export function isValidPhone(value) {
  if (!value) return false;
  const re = /^\+?(\d[\d\s\-()]*)$/;
  // Require at least 10 digits after stripping non-digits
  const digits = value.replace(/\D/g, "");
  return re.test(value) && digits.length >= 10 && digits.length <= 15;
}

// Simple PIN code validation (India 6-digit)
export function isValidPin(value) {
  if (!value) return false;
  return /^[1-9][0-9]{5}$/.test(value.trim());
}

export function isNonEmpty(value) {
  return typeof value === "string"
    ? value.trim().length > 0
    : value !== null && value !== undefined;
}



