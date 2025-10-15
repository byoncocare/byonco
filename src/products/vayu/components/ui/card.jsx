import React from "react";

export const Card = ({ className = "", ...props }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props} />
);

export const CardHeader = ({ className = "", ...props }) => (
  <div className={`p-6 pb-3 ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
);

export const CardTitle = ({ className = "", ...props }) => (
  <h3 className={`text-xl font-semibold ${className}`} {...props} />
);

export default Card;
