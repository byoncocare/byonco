// src/components/TeamSection.jsx
import { motion } from 'framer-motion';

const affiliations = [
  {
    src: '/logos/meta.svg',
    alt: 'Meta (formerly Facebook)',
    label: 'Team member from Meta',
    heightClass: 'h-8 sm:h-12',
  },
  {
    src: '/logos/harvard.svg',
    alt: 'Harvard University',
    label: 'Team member from Harvard University',
    heightClass: 'h-8 sm:h-10',
  },
  {
    src: '/logos/microsoft.svg',
    alt: 'Microsoft',
    label: 'Team member from Microsoft',
    heightClass: 'h-8 sm:h-12',
  },
];

export default function TeamSection() {
  return (
    <section
      className="bg-[#f6f5f3] py-16 px-6 sm:px-8 md:px-12 lg:px-20"
      aria-labelledby="team-heading"
    >
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h3
          id="team-heading"
          className="text-lg md:text-xl font-semibold text-gray-800 mb-10 sm:mb-14"
        >
          Built by a world-class team
        </h3>

        <div className="flex flex-row flex-wrap justify-center items-center gap-6 sm:gap-20 md:gap-20">
          {affiliations.map((item, index) => (
            <motion.img
              key={index}
              src={item.src}
              alt={item.alt}
              aria-label={item.label}
              role="img"
              className={`${item.heightClass} w-auto object-contain transition-transform duration-300 hover:scale-105 hover:-translate-y-1`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
