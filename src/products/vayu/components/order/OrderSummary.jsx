// src/products/vayu/components/order/OrderSummary.jsx
import React from "react";
import { VAYU_PRODUCT, getVariantById } from "../../utils/pricing";

export default function OrderSummary({
  item,
  couponCode,
  onCouponChange,
  pricing,
}) {
  if (!item) return null;
  const variant = getVariantById(item.variantId);

  const {
    subtotal,
    shipping,
    discount,
    total,
    totalSavings,
  } = pricing || {
    subtotal: item.unitPrice * item.quantity,
    shipping: 0,
    discount: 0,
    total: item.unitPrice * item.quantity,
    totalSavings: 0,
  };

  return (
    <aside
      className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl sticky top-28 space-y-6"
      aria-label="Order summary"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
          <img
            src={item.image || VAYU_PRODUCT.images[0]}
            alt="Vayu AI Glasses thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium text-white">
            {item.name}
          </h2>
          <p className="text-xs text-white/60">
            {variant.label} • Qty {item.quantity}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Coupon */}
      <div className="space-y-2">
        <label
          htmlFor="coupon"
          className="text-xs font-medium uppercase tracking-[0.18em] text-white/50"
        >
          Coupon
        </label>
        <div className="flex gap-2">
          <input
            id="coupon"
            type="text"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
            className="flex-1 px-3 py-2 rounded-full bg-black/60 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
            placeholder="Enter code (e.g., LAUNCH2025)"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 text-sm text-white/80">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Discount</span>
            <span>-₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="h-px bg-white/10 my-3" />
        <div className="flex justify-between text-base font-semibold text-white">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {totalSavings > 0 && (
        <p className="text-xs text-emerald-400 flex items-center justify-between">
          <span>TOTAL SAVINGS</span>
          <span>₹{totalSavings.toLocaleString("en-IN")}</span>
        </p>
      )}
    </aside>
  );
}



