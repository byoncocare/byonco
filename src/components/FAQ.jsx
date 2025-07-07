// src/components/FAQ.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqItems = [
  {
    question: "How does ByOnco use AI to match patients to the right hospitals?",
    answer: "ByOnco uses patient-specific data like type, stage, and urgency of cancer, financial background, and real-time hospital load to recommend the best care options using our proprietary AI matching engine."
  },
  {
    question: "Is ByOnco free to use?",
    answer: "Yes, ByOnco is completely free for patients. We also partner with NGOs and government schemes to ensure affordability."
  },
  {
    question: "Can I use ByOnco for my pet's cancer care?",
    answer: "Absolutely. ByOnco PetCare is India's first AI-driven cancer support platform for pets, offering matching with vet oncologists, diagnostics, and treatment pathways."
  },
  {
    question: "How accurate is ByOnco's hospital availability information?",
    answer: "We fetch real-time data directly from hospitals regarding bed occupancy, waiting time, and doctor availability through our secure hospital integrations."
  },
  {
    question: "Will ByOnco store my personal data securely?",
    answer: "Yes. We are compliant with India's data protection laws and all personal data is encrypted end-to-end and never sold or shared without your consent."
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#fdfdfd] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked <span className="text-orange-500 underline decoration-wavy">Questions</span>
        </h2>

        <ul className="space-y-4" role="list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const itemId = `faq-${index}`;

            return (
              <li key={index}>
                <div
                  tabIndex={0}
                  role="button"
                  aria-expanded={isOpen}
                  aria-controls={`${itemId}-content`}
                  className="bg-[#fff6f2] rounded-lg p-5 shadow-sm hover:shadow-md focus:shadow-md outline-none transition-all duration-300 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFAQ(index);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-base md:text-lg font-medium text-gray-900">
                      {item.question}
                    </p>
                    <motion.span
                      className="text-xl font-bold text-gray-600"
                      initial={false}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      +
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        id={`${itemId}-content`}
                        className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
