import React from "react";
import { faqData } from "../data/mock";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const [sectionRef, sectionRevealed] = useRevealOnScroll({ threshold: 0.1 });

  return (
    <section className="section-padding relative bg-transparent">
      {/* Ambient glow behind section - removed to allow global background through */}

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 ${sectionRevealed ? 'revealed' : 'reveal-on-scroll'}`} ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-newreader font-semibold tracking-tighter text-white mb-3 md:mb-4 px-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light px-4">
            Get answers to common questions about Vayu X smart glasses
          </p>
        </div>

        {/* FAQ Accordion - details/summary based */}
        <div className="w-full space-y-4 mb-12">
          {faqData.map((faq, index) => (
            <details
              key={index}
              className="group glass-panel rounded-2xl overflow-hidden"
            >
              <summary className="p-4 md:p-6 flex justify-between items-center cursor-pointer list-none hover:bg-white/5 transition-colors">
                <span className="font-semibold text-sm sm:text-base text-white pr-4">{faq.question}</span>
                <ChevronDown className="h-5 w-5 text-white/60 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-4 md:px-6 pb-8 md:pb-12 text-gray-400 text-sm leading-relaxed font-light">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-6 font-light">
            Our team is here to help. Reach out to us for personalized support.
          </p>
          <a
            href="mailto:contact@byoncocare.com"
            className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full"
          >
            <span className="absolute inset-0 bg-[#1E5BFF] rounded-full opacity-100"></span>
            <span className="relative bg-[#1E5BFF] group-hover:bg-[#2F6BFF] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-colors z-10">
              Contact Support
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
