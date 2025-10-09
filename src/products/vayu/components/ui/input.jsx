import React, { forwardRef } from "react";

export const Input = forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full h-10 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
export default Input;
