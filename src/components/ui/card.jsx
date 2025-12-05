// src/components/ui/card.jsx
import React from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-xl border shadow-sm p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx("mb-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={clsx("text-lg font-semibold", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={clsx("text-sm", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={clsx("leading-relaxed", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div className={clsx("mt-4 flex items-center justify-end gap-2", className)}>
      {children}
    </div>
  );
}

export default Card;
