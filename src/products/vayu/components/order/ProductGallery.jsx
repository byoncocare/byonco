// src/products/vayu/components/order/ProductGallery.jsx
import React from "react";

export default function ProductGallery({ images, activeIndex, onChange }) {
  if (!images || images.length === 0) return null;

  const safeIndex =
    typeof activeIndex === "number" && activeIndex >= 0 && activeIndex < images.length
      ? activeIndex
      : 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
      {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
      <div
        className="flex md:flex-col gap-3 md:gap-4 md:w-20 lg:w-24"
        aria-label="Product images"
        role="list"
      >
        {images.map((src, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={src + index}
              type="button"
              onClick={() => onChange(index)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                isActive
                  ? "border-white ring-2 ring-white ring-offset-2 ring-offset-black"
                  : "border-white/20 hover:border-white/40"
              }`}
              role="listitem"
              aria-label={`View image ${index + 1}`}
              data-pressed={isActive}
            >
              <img
                src={src}
                alt={`Vayu AI Glasses view ${index + 1}`}
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-cover block opacity-100 mix-blend-normal relative z-30"
                loading={index > 1 ? "lazy" : "eager"}
                style={{ display: 'block', visibility: 'visible', position: 'relative' }}
              />
            </button>
          );
        })}
      </div>

      {/* Main image */}
      <div className="flex-1">
        <div className="relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-lg">
          <img
            src={images[safeIndex]}
            alt="Vayu AI Glasses"
            className="relative w-full h-auto object-cover aspect-square md:aspect-auto md:max-h-[600px] md:min-h-[500px] block opacity-100 mix-blend-normal z-30"
            style={{ objectFit: "contain", display: 'block', visibility: 'visible', position: 'relative' }}
          />
        </div>
      </div>
    </div>
  );
}


