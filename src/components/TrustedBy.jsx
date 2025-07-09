// components/TrustedBy.jsx
import { motion } from 'framer-motion';

const hospitalLogos = [
  {
    src: '/logos/hospitals/tmc.png',
    alt: 'Tata Memorial Centre',
  },
  {
    src: '/logos/hospitals/apollo.png',
    alt: 'Apollo Hospitals',
  },
  {
    src: '/logos/hospitals/kdah.png',
    alt: 'Kokilaben Dhirubhai Ambani Hospital',
  },
  {
    src: '/logos/hospitals/fortis.png',
    alt: 'Fortis Hospitals',
  },
  {
    src: '/logos/hospitals/cca.png',
    alt: 'Cancer Centers of America',
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

const logoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TrustedBy() {
  return (
    <motion.section
      className="bg-[#f9fafb] py-14 px-4 sm:px-6 md:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      aria-labelledby="trusted-heading"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2
          id="trusted-heading"
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-10"
        >
          Trusted by India’s Leading Cancer Hospitals
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 sm:gap-x-14 sm:gap-y-10">
          {hospitalLogos.map((logo, index) => (
            <motion.img
              key={index}
              src={logo.src}
              alt={logo.alt}
              title={logo.alt}
              loading="lazy"
              className="h-10 sm:h-12 md:h-14 max-h-16 object-contain grayscale hover:grayscale-0 transition duration-300 ease-in-out"
              role="img"
              aria-label={logo.alt}
              variants={logoVariants}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
