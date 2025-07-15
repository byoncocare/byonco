// src/components/HowItWorks.jsx
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaSearch,
  FaCalendarCheck,
  FaHandsHelping,
} from 'react-icons/fa';

const steps = [
  {
    icon: <FaHospital size={36} className="text-orange-600" />,
    title: 'Tell Us Your Needs',
    desc: 'Answer a few questions about your condition, budget, location & insurance.',
  },
  {
    icon: <FaSearch size={36} className="text-blue-600" />,
    title: 'We Match You Instantly',
    desc: 'Our AI filters through real-time hospital and doctor data to find the right fit.',
  },
  {
    icon: <FaCalendarCheck size={36} className="text-green-600" />,
    title: 'Book & Track',
    desc: 'Set appointments, upload reports, and monitor progress in one seamless dashboard.',
  },
  {
    icon: <FaHandsHelping size={36} className="text-purple-600" />,
    title: 'Get Help When You Need',
    desc: 'From NGO support to international opinions, we’ve got your back — anytime.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="bg-white py-16 px-4 sm:px-6 md:px-16 lg:px-24"
      aria-label="How ByOnco Works Section"
    >
      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How ByOnco Works
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          From personalized matching to financial aid — here’s how we guide your cancer journey.
        </p>
      </motion.div>

      {/* Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <motion.article
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            aria-label={step.title}
          >
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
