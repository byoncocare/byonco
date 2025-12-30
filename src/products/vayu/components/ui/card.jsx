import React from "react";

export const Card = ({ className = "", ...props }) => (
  <div className={`glass-panel rounded-xl ${className}`} {...props} />
);

export const CardFooter = ({ className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export const CardHeader = ({ className = "", ...props }) => (
  <div className={`p-6 pb-3 ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
);

export const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-xl font-semibold ${className}`} {...props}>
    {children || <span className="sr-only">Card Title</span>}
  </h3>
);

export default Card;
