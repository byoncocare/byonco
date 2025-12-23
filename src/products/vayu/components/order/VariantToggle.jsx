// src/products/vayu/components/order/VariantToggle.jsx
import React from "react";

export default function VariantToggle({ variants, value, onChange }) {
  return (
    <div
      className="inline-flex rounded-lg bg-white/10 p-1 border border-white/20"
      role="tablist"
      aria-label="Choose lens type"
    >
      {variants.map((variant) => {
        const isActive = variant.id === value;
        return (
          <button
            key={variant.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(variant.id)}
            className={`px-6 py-3 text-sm sm:text-base rounded-md transition-all font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#1E5BFF] ${
              isActive
                ? "bg-white text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}


