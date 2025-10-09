import React from "react";

export const Label = ({ className = "", ...props }) => (
  <label className={`mb-1 block text-sm font-medium text-gray-700 ${className}`} {...props} />
);

export default Label;
