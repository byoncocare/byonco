// src/components/AboutByOnco.jsx
import { motion } from 'framer-motion';
import { FaUserMd, FaHeartbeat, FaPaw } from 'react-icons/fa';

const contentItems = [
  {
    icon: <FaUserMd size={32} className="text-orange-600" aria-hidden="true" />,
    title: 'Built for Indian Patients',
    desc: 'From Tier 1 cities to rural districts — ByOnco bridges India’s cancer care gap regardless of income or geography.',
  },
  {
    icon: <FaHeartbeat size={32} className="text-blue-600" aria-hidden="true" />,
    title: 'AI Meets Compassion',
    desc: 'We use real-time hospital insights, but it’s urgency, empathy, and human context that power every recommendation.',
  },
  {
    icon: <FaPaw size={32} className="text-purple-600" aria-hidden="true" />,
    title: 'Pet Oncology Support',
    desc: 'We go beyond human care — helping families find cancer treatment pathways for pets too.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutByOnco() {
  return (
    <motion.section
      className="bg-[#fefcfb] py-16 px-4 sm:px-6 md:px-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      aria-labelledby="about-byonco-title"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Heading */}
        <motion.h2
          id="about-byonco-title"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About ByOnco
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <strong>ByOnco</strong> is an AI-powered cancer care platform designed for India. We help patients and families discover the right hospitals, treatment plans, and financial support — quicker, cheaper, and with greater compassion. <br />
          <span className="text-orange-600 font-semibold">Our mission is to save lives through better access.</span>
        </motion.p>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              role="region"
              aria-label={item.title}
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 text-center sm:text-left">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
