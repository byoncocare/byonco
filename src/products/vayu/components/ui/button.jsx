import React, { forwardRef } from "react";

export const Button = forwardRef(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-gray-900 text-white hover:bg-gray-800",
      outline: "border-2 border-gray-300 text-gray-800 bg-white hover:border-blue-600",
      ghost: "bg-transparent hover:bg-gray-100",
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-6 text-base",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export default Button;
