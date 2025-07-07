// src/components/TeamAffiliations.jsx
import { motion } from 'framer-motion';

const affiliations = [
  {
    src: '/logos/meta.svg',
    alt: 'Meta (formerly Facebook)',
    label: 'Team member from Meta',
    height: 'h-8',
  },
  {
    src: '/logos/harvard.svg',
    alt: 'Harvard University',
    label: 'Team member from Harvard University',
    height: 'h-10',
  },
  {
    src: '/logos/microsoft.svg',
    alt: 'Microsoft',
    label: 'Team member from Microsoft',
    height: 'h-8',
  },
];

export default function TeamAffiliations() {
  return (
    <section className="bg-[#f6f5f3] py-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-lg font-medium text-gray-700 mb-12">
          Built by a world class team
        </h3>

        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10">
          {affiliations.map((item, index) => (
            <motion.img
              key={index}
              src={item.src}
              alt={item.alt}
              aria-label={item.label}
              role="img"
              className={`${item.height} w-auto object-contain transition-transform duration-300 hover:scale-110 hover:-translate-y-1`}
              initial={{ opacity: 0, scale: 0.9 }}
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
