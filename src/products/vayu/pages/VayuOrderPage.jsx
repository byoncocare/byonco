// src/products/vayu/pages/VayuOrderPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import ProductGallery from "../components/order/ProductGallery";
import VariantToggle from "../components/order/VariantToggle";
import QuantityStepper from "../components/order/QuantityStepper";
import {
  VAYU_PRODUCT,
  getVariantById,
  calculateLineTotal,
  getUnitPrice,
  getCompareAtPrice,
} from "../utils/pricing";
import { saveCart } from "../utils/cart";

const FEATURE_LIST = [
  "Private heads-up display",
  "Voice-based interaction",
  "Real-time translation (40+ languages)",
  "12+ hours battery life",
  "Conversation notes and reminders",
  "6-month warranty",
];

export default function VayuOrderPage() {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState(VAYU_PRODUCT.variants[0].id);
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(() => getVariantById(variantId), [variantId]);
  const unitPrice = useMemo(() => getUnitPrice(variantId), [variantId]);
  const compareAtPrice = useMemo(
    () => getCompareAtPrice(variantId),
    [variantId]
  );
  const subtotal = useMemo(
    () => calculateLineTotal(variantId, quantity),
    [variantId, quantity]
  );

  const handleOrderNow = () => {
    const cart = {
      items: [
        {
          productId: VAYU_PRODUCT.id,
          name: VAYU_PRODUCT.name,
          variantId,
          variantLabel: variant.label,
          quantity,
          unitPrice,
              compareAtPrice,
          image: VAYU_PRODUCT.images[0],
        },
      ],
      currency: "INR",
    };

    saveCart(cart);
    navigate("/products/vayu/checkout");
  };

  const isPrescription = variantId === "prescription";

  return (
    <div className="page-shell min-h-screen bg-gradient-to-b from-black via-[#020617] to-black text-white">
      <Navbar />

      <main className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Left: Product Gallery */}
            <section aria-label="Vayu AI Glasses gallery" className="order-2 lg:order-1">
              <ProductGallery
                images={VAYU_PRODUCT.images}
                activeIndex={activeImage}
                onChange={setActiveImage}
              />
            </section>

            {/* Right: Product Details */}
            <section className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              {/* Product Title */}
              <header className="space-y-2">
                <p className="uppercase tracking-[0.2em] text-xs font-medium text-white/50">
                  VAYU X
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Vayu AI Glasses
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-xl">
                  Glasses that answer what matters, designed to disappear into your day.
                </p>
              </header>

              {/* Price Display */}
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    ₹{unitPrice.toLocaleString("en-IN")}
                  </span>
                  {compareAtPrice && (
                    <span className="text-lg text-white/40 line-through">
                      ₹{compareAtPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60">
                  For Professionals &amp; Students
                </p>
              </div>

              {/* Included features */}
              <div className="pt-3 space-y-2 text-sm text-white/80">
                {FEATURE_LIST.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Lens Type Selector */}
              <div className="space-y-4 pt-2">
                <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-white/50">
                  Lens Type
                </label>
                <VariantToggle
                  variants={VAYU_PRODUCT.variants}
                  value={variantId}
                  onChange={setVariantId}
                />
                
                {/* Prescription Helper Note */}
                {isPrescription && (
                  <div className="mt-3 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white leading-relaxed">
                      {variant.helper}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="pt-2">
                <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-white/50 mb-3">
                  Quantity
                </label>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              {/* Order Now Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="w-full bg-white hover:bg-white/90 text-black px-8 py-4 rounded-lg text-base font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Order Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* Shipping & Warranty Note */}
              <div className="pt-4 space-y-3 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Total for {quantity} pair{quantity > 1 ? "s" : ""}</span>
                  <span className="font-semibold text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-sm text-white/70">
                  <p>{VAYU_PRODUCT.shippingNote}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


