import React from "react";

export const Badge = ({ className = "", ...props }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${className}`} {...props} />
);

export default Badge;
