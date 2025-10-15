import React, { useRef, useState } from "react";
import { faqData } from "../data/mock";

/**
 * Lightweight, dependency-free accordion item
 * - A11y: aria-expanded/controls, button semantics
 * - Smooth height animation using measured scrollHeight
 * - Rotating chevron, same Tailwind look as your previous version
 */
function Item({ id, question, answer, isOpen, onToggle }) {
  const panelRef = useRef(null);
  const maxH = isOpen ? `${panelRef.current?.scrollHeight ?? 0}px` : "0px";

  return (
    <div className="bg-white rounded-lg shadow-sm border-0">
      <button
        type="button"
        className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-lg font-semibold text-gray-900 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        onClick={onToggle}
        id={`faq-trigger-${id}`}
      >
        <span>{question}</span>
        {/* Chevron */}
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
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

      {/* Collapsible content */}
      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        ref={panelRef}
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

const FAQSection = () => {
  // Single-open accordion (collapsible). -1 = all closed.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about Vayu X smart glasses
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <Item
                key={index}
                id={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
              />
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Reach out to us for personalized support.
          </p>
          <a
            href="mailto:team@vayu.so"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
