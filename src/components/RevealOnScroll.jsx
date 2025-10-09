// src/components/RevealOnScroll.jsx
import React, { useEffect, useRef } from "react";

export default function RevealOnScroll({ as: Tag = "div", className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`mk-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
