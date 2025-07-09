// src/components/Testimonials.jsx
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Aarav, 3 — Pune',
    content: 'ByOnco helped us find a pediatric oncologist in minutes. We were lost after the diagnosis, but the app guided us to the right hospital near home.',
  },
  {
    name: 'Rekha, 42 — Nashik',
    content: 'Diagnosed with cervical cancer and limited funds, ByOnco not only found affordable care but also helped connect us with financial NGOs.',
  },
  {
    name: 'Sanjay, 66 — Delhi',
    content: 'During recurrence, we didn’t know where to go. ByOnco helped us register at TMC and even scheduled the second opinion online.',
  },
  {
    name: 'Zoya, 19 — Hyderabad',
    content: 'As a student with Hodgkin’s lymphoma, I found help within 4km of my college. ByOnco made matching so simple with its 1-prompt AI.',
  },
  {
    name: 'Mahesh, 58 — Indore',
    content: 'We wasted weeks looking offline. ByOnco showed real-time bed availability and helped us admit my wife within hours.',
  },
  {
    name: 'Anika, 29 — Jaipur',
    content: 'During our darkest time, ByOnco matched us to a hospital where my husband was treated with compassion and expertise.',
  },
  {
    name: 'Farhan, 35 — Lucknow',
    content: 'Stage 3 lung cancer. We got Tata Memorial’s slot alert via ByOnco and registered without paying brokers.',
  },
  {
    name: 'Asha, 61 — Mumbai',
    content: 'ByOnco suggested hospitals that accepted my insurance and even reminded me of appointments through WhatsApp.',
  },
  {
    name: 'Bhavesh, 27 — Ahmedabad',
    content: 'As a vet, I used ByOnco for my pet Labrador’s tumor — first time I’ve seen such a feature in India. Huge relief!',
  },
  {
    name: 'Dimple, 49 — Chandigarh',
    content: 'Breast cancer returned after 7 years. ByOnco showed me a hospital with a lower waiting period and helped get a private consultation fast.',
  },
];

export default function Testimonials() {
  return (
    <section
      className="bg-white py-16 px-4 sm:px-6 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <h2
        id="testimonials-heading"
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10"
      >
        What Patients & Partners Say
      </h2>

      <div className="relative w-full overflow-x-auto">
        <motion.div
          className="flex gap-4 sm:gap-6 w-max scroll-smooth snap-x snap-mandatory"
          initial={{ x: 0 }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: 90,
            ease: 'linear',
          }}
          role="list"
          aria-label="Patient Testimonials"
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.article
              key={i}
              className="snap-start bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 w-72 sm:w-80 flex-shrink-0 transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus-within:shadow-lg focus-within:outline-none"
              tabIndex="0"
              role="listitem"
              aria-label={`Testimonial from ${t.name}`}
            >
              <div className="flex items-start gap-3">
                <FaQuoteLeft className="text-orange-400 text-xl mt-1" aria-hidden="true" />
                <p className="text-sm text-gray-800 leading-relaxed">
                  {t.content}
                </p>
              </div>
              <footer className="mt-4 text-sm font-semibold text-gray-900">
                — {t.name}
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
