import React, { createContext, useContext, useState } from "react";

const AccContext = createContext(null);

export const Accordion = ({ type = "single", collapsible = false, children, className = "" }) => {
  const [open, setOpen] = useState(null);
  const value = { open, setOpen, type, collapsible };
  return (
    <div className={`divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white ${className}`}>
      <AccContext.Provider value={value}>{children}</AccContext.Provider>
    </div>
  );
};

export const AccordionItem = ({ value, children }) => {
  return <div data-value={value}>{children}</div>;
};

export const AccordionTrigger = ({ children, className = "", ...props }) => {
  const { open, setOpen, type, collapsible } = useContext(AccContext);
  // find the parent item value
  const val = props?.["data-value"] || props?.value || null;

  const onClick = () => {
    if (type === "single") {
      if (collapsible && open === val) setOpen(null);
      else setOpen(val);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center justify-between ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="ml-4 text-gray-400">{open === val ? "−" : "+"}</span>
    </button>
  );
};

export const AccordionContent = ({ children, className = "", ...props }) => {
  const { open } = useContext(AccContext);
  const val = props?.["data-value"] || props?.value || props?.parentValue || null;
  const isOpen = open === val;
  return isOpen ? <div className={`px-4 pb-4 ${className}`}>{children}</div> : null;
};

// Helper HOC to pass item value to Trigger/Content automatically
export const withItemValue = (Component) => (props) => {
  const value = props?.value;
  return <Component {...props} data-value={value} />;
};

// Re-export wrappers so your current JSX works unchanged:
export const WrappedAccordionItem = ({ value, children }) => (
  <AccordionItem value={value}>
    {React.Children.map(children, (child) =>
      React.isValidElement(child) ? React.cloneElement(child, { value }) : child
    )}
  </AccordionItem>
);

// To keep your imports identical, alias:
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";
