// src/components/Features.jsx
import { motion } from 'framer-motion';

const features = [
  {
    icon: '📍',
    title: 'Location-Based Matching',
    desc: 'Find hospitals near you or in preferred cities with availability, waiting time, and distance filters.',
  },
  {
    icon: '💰',
    title: 'Budget & Insurance Support',
    desc: 'Choose hospitals based on your budget, or filter for ones that support insurance or NGOs for financial aid.',
  },
  {
    icon: '📊',
    title: 'Real-Time Bed & Doctor Info',
    desc: 'Live data on bed availability, doctor schedules, and treatment slots to save precious time.',
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor Experience Filter',
    desc: 'See specialist profiles, success rates, and number of similar cases treated before you decide.',
  },
  {
    icon: '📁',
    title: 'Reports & Dashboard',
    desc: 'Track every stage — from appointment booking to treatment progress — all in one secure dashboard.',
  },
  {
    icon: '🐾',
    title: 'Pet Cancer Support',
    desc: 'India’s first pet oncology integration — because pets deserve care too.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section
      className="bg-[#f9fafb] py-16 px-4 sm:px-6 md:px-20"
      aria-labelledby="features-heading"
      role="region"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-8"
        >
          Key Features
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left"
          variants={containerVariants}
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] focus-within:shadow-md focus-within:outline-none"
              variants={cardVariants}
              tabIndex={0}
              aria-label={`Feature card: ${item.title}`}
              role="article"
            >
              <div
                className="text-3xl sm:text-4xl mb-4 text-center"
                role="img"
                aria-label={`${item.title} icon`}
              >
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
