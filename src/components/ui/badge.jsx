// src/components/ui/badge.jsx
import React from "react";
import clsx from "clsx";

export function Badge({ children, className }) {
  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
