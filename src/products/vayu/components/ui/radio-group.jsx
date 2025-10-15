import React, { createContext, useContext } from "react";

const RGContext = createContext({ value: undefined, onChange: () => {} });

export const RadioGroup = ({ value, onValueChange, children, className = "" }) => {
  return (
    <RGContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </RGContext.Provider>
  );
};

export const RadioGroupItem = ({ id, value, className = "", ...props }) => {
  const { value: groupValue, onChange } = useContext(RGContext);
  const checked = groupValue === value;
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-4 w-4 accent-blue-600 ${className}`}
      {...props}
    />
  );
};

export default RadioGroup;
