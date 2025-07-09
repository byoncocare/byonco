// src/components/WhyAI.jsx
import { motion } from 'framer-motion';

const points = [
  {
    title: 'Not Just Listings — Real Matching',
    desc: 'ByOnco doesn’t show all hospitals. It recommends only those that fit your exact need — from budget to disease type, insurance, waiting period, and doctor experience.',
    emoji: '🎯',
  },
  {
    title: 'Built for Urgency',
    desc: 'Our AI prioritizes hospitals with lowest waiting times and real-time bed availability. Because cancer care shouldn’t wait.',
    emoji: '⏱️',
  },
  {
    title: 'Empathy Meets Intelligence',
    desc: 'Beyond data, we consider emotional, financial, and geographic constraints to guide families towards the right decisions — with compassion.',
    emoji: '🧠❤️',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function WhyAI() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 md:px-20">
      {/* Heading */}
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
          Why Our AI is Different
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
          At ByOnco, our algorithms are trained not just on hospital data — but on human struggles.
          Every recommendation is filtered through
          <span className="text-orange-600 font-semibold"> empathy, urgency, and precision.</span>
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {points.map((point, i) => (
          <motion.div
            key={i}
            role="region"
            aria-label={point.title}
            variants={cardVariants}
            className="bg-[#f9fafb] p-6 rounded-xl shadow-sm border border-gray-100 transition transform hover:shadow-lg hover:scale-105 duration-300 ease-in-out"
          >
            <div className="flex justify-center mb-4 text-3xl sm:text-4xl" aria-hidden="true">
              {point.emoji}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">
              {point.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed text-center">
              {point.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
