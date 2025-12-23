// src/products/vayu/components/order/QuantityStepper.jsx
import React from "react";

export default function QuantityStepper({ value, onChange, min = 1, max = 5 }) {
  const safe = Number.isFinite(value) ? value : 1;

  const handleChange = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    onChange(clamped);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-white/20 bg-white text-black shadow-sm">
      <button
        type="button"
        onClick={() => handleChange(safe - 1)}
        className="px-4 py-2.5 text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#1E5BFF] rounded-l-lg"
        aria-label="Decrease quantity"
        disabled={safe <= min}
      >
        −
      </button>
      <div className="px-6 py-2.5 min-w-[3.5rem] text-center text-base font-semibold select-none border-x border-white/20">
        {safe}
      </div>
      <button
        type="button"
        onClick={() => handleChange(safe + 1)}
        className="px-4 py-2.5 text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#1E5BFF] rounded-r-lg"
        aria-label="Increase quantity"
        disabled={safe >= max}
      >
        +
      </button>
    </div>
  );
}


