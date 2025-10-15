import React, { useRef, useState } from "react";

/**
 * Reusable, dependency-free accordion
 * - Single-open by default (collapsible); pass multiple={true} to allow many open
 * - A11y: proper button semantics + aria-expanded/controls
 * - Smooth height animation based on measured scrollHeight
 */
export function Accordion({ items, defaultOpen = -1, multiple = false, className = "" }) {
  const [open, setOpen] = useState(
    multiple ? new Set([].filter(Boolean)) : defaultOpen
  );

  const toggle = (idx) => {
    if (multiple) {
      const next = new Set(open);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      setOpen(next);
    } else {
      setOpen(open === idx ? -1 : idx);
    }
  };

  const isOpen = (idx) => (multiple ? open.has(idx) : open === idx);

  return (
    <div className={className}>
      <div className="w-full space-y-4">
        {items.map((it, idx) => (
          <AccordionItem
            key={idx}
            id={idx}
            question={it.question}
            answer={it.answer}
            isOpen={isOpen(idx)}
            onToggle={() => toggle(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export function AccordionItem({ id, question, answer, isOpen, onToggle }) {
  const ref = useRef(null);
  const maxH = isOpen ? `${ref.current?.scrollHeight ?? 0}px` : "0px";

  return (
    <div className="bg-white rounded-lg shadow-sm border-0">
      <button
        type="button"
        className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-lg font-semibold text-gray-900 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-expanded={isOpen}
        aria-controls={`acc-panel-${id}`}
        onClick={onToggle}
        id={`acc-trigger-${id}`}
      >
        <span>{question}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        id={`acc-panel-${id}`}
        role="region"
        aria-labelledby={`acc-trigger-${id}`}
        ref={ref}
        style={{ maxHeight: maxH }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="px-6 pb-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      </div>
    </div>
  );
}
