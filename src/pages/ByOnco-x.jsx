// src/pages/ByOnco-x.jsx  (make sure this name matches your App.js import)

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- Images (use the correct extensions that exist in your folder) ---
import heroMain from "../assets/products/byonco-x/hero-main.jpg";   // change to .png if your file is PNG
import thumbFront from "../assets/products/byonco-x/thumb-front.jpg";
import thumbSide from "../assets/products/byonco-x/thumb-side.jpg";

// --------------------------- constants & helpers ---------------------------
const CURRENCY = "₹";
const LAUNCH_PRICE = 42999; // Introductory price
const MSRP = 49999;         // Post-launch price

const formatINR = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
    .format(v)
    .replace("₹", CURRENCY);

const Badge = ({ children, tone = "neutral" }) => {
  const map = {
    neutral: "bg-slate-100 text-slate-800",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[tone]} whitespace-nowrap`}
    >
      {children}
    </span>
  );
};

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    {(title || subtitle) && (
      <header className="mb-8">
        {subtitle && (
          <p className="text-sm font-semibold tracking-wide text-violet-600">
            {subtitle}
          </p>
        )}
        {title && (
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
        )}
      </header>
    )}
    {children}
  </section>
);

const FeatureCard = ({ title, desc, icon }) => (
  <motion.div
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.35 }}
    className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md"
  >
    <div className="mb-4 text-2xl">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
  </motion.div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-slate-900">{q}</span>
        <span className="ml-4 text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-5 text-sm leading-6 text-slate-600">{a}</div>}
    </div>
  );
};

// ==========================================================================

export default function ByOncoX() {
  const [qty, setQty] = useState(1);
  const [lensType, setLensType] = useState("non-prescription");
  const [active, setActive] = useState(0);

  // Gallery set — hero + two angles (no "case" image per your request)
  const IMAGES = [
    { src: heroMain, alt: "ByOnco X — side profile with BYONCO branding" },
    { src: thumbFront, alt: "ByOnco X — front view" },
    { src: thumbSide, alt: "ByOnco X — side view" },
  ];

  return (
    <main className="bg-white">
      {/* ====== HERO (Gallery + Buy panel) ====== */}
      <div className="border-b border-slate-100 bg-gradient-to-b from-white via-white to-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* ---------- Gallery ---------- */}
          <div>
            {/* Main display keeps a fixed height and 'object-contain' so it never looks oversized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-white"
            >
              <div className="h-[520px] md:h-[560px] w-full bg-slate-50">
                <img
                  src={IMAGES[active].src}
                  alt={IMAGES[active].alt}
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {IMAGES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-2xl border transition ${
                    active === i
                      ? "border-slate-900 ring-2 ring-slate-900/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  aria-label={`View ${t.alt}`}
                >
                  <div className="h-28 w-full bg-white">
                    <img src={t.src} alt={t.alt} className="h-full w-full object-contain" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Details / Buy panel ---------- */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Badge tone="violet">New</Badge>
              <Badge>Made for India</Badge>
              <Badge tone="success">Pre-Order</Badge>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              ByOnco X
            </h1>

            <p className="mt-3 max-w-prose text-slate-600">
              Smart glasses designed for real life in India — privacy-safe AI assistance, natural-language
              translations, meeting notes, and instant recall. Built to empower <b>caregivers, clinicians,
              lawyers, and everyday professionals</b>.
            </p>

            {/* Price row */}
            <div className="mt-6 flex items-end gap-3">
              <p className="text-3xl font-bold text-slate-900">{formatINR(LAUNCH_PRICE)}</p>
              <p className="text-lg text-slate-400 line-through">{formatINR(MSRP)}</p>
              <Badge tone="warning">Intro price</Badge>
            </div>

            {/* Lens Type */}
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700">Lens Type</p>
              <div className="mt-3 inline-flex rounded-xl border border-slate-200 p-1">
                {[
                  { key: "non-prescription", label: "Non-Prescription" },
                  { key: "prescription", label: "Prescription" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLensType(opt.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      lensType === opt.key
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTAs */}
            <div className="mt-5 flex items-center gap-4">
              <div className="inline-flex items-center rounded-xl border border-slate-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Link
                to="/checkout/byonco-x"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/50"
              >
                Pre-Order Now
              </Link>
              <a
                href="#features"
                className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
              >
                Explore features
              </a>
            </div>

            <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>
                Ships Pan-India from <b>January 2026</b>. Fully refundable until dispatch.
              </li>
              <li>6-month standard warranty (extendable to 12 months).</li>
              <li>EMI, UPI, major cards supported. GST invoice provided.</li>
              <li>
                Prescription lens orders: we’ll contact you after purchase for power & pricing.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ====== VARIANTS ====== */}
      <Section id="variants" title="Choose your edition" subtitle="ByOnco X Family">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "ByOnco X Classic",
              status: <Badge tone="success">Pre-Order</Badge>,
              desc:
                "Everyday AI glasses for productivity, translation, calls, and private note-taking.",
              cta: (
                <Link
                  to="/checkout/byonco-x"
                  className="text-sm font-semibold text-violet-700 hover:underline"
                >
                  Pre-Order
                </Link>
              ),
            },
            {
              title: "ByOnco X • Healthcare",
              status: <Badge tone="warning">Launching Soon</Badge>,
              desc:
                "For clinicians, caregivers & patients: visit summaries, medication reminders, safety checks.",
              cta: <span className="text-sm text-slate-500">Notify me</span>,
            },
            {
              title: "ByOnco X • Legal",
              status: <Badge tone="warning">Launching Soon</Badge>,
              desc:
                "For practitioners & teams: research recall, exhibit tagging, hearing transcripts, on-the-go drafting.",
              cta: <span className="text-sm text-slate-500">Notify me</span>,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{c.title}</h3>
                  {c.status}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{c.desc}</p>
              </div>
              <div className="mt-4">{c.cta}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ====== FEATURES ====== */}
      <Section id="features" title="Designed for India. Engineered for trust." subtitle="Key capabilities">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Real-time answers"
            desc="Ask naturally. Get context-aware assistance that respects privacy and works offline for core tasks."
            icon={"💡"}
          />
          <FeatureCard
            title="Active note-taking"
            desc="Meeting, clinic visit, or client call — capture, summarize, and export notes hands-free."
            icon={"📝"}
          />
          <FeatureCard
            title="Memory recall"
            desc="Instantly surface what you’ve seen or heard before — names, details, instructions."
            icon={"🧠"}
          />
          <FeatureCard
            title="40+ languages"
            desc="English plus Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Gujarati, Punjabi, Malayalam, and more."
            icon={"🌐"}
          />
          <FeatureCard
            title="Custom knowledge"
            desc="Securely add documents for tailored answers — patient files, case law, PDFs, SOPs."
            icon={"📁"}
          />
          <FeatureCard
            title="All-day comfort"
            desc="Feather-light frame, balanced weight, and long battery life with fast USB-C charging."
            icon={"🕶️"}
          />
        </div>
      </Section>

      {/* ====== DIFFERENTIATORS / SPECS ====== */}
      <Section id="compare" title="What makes ByOnco X different?" subtitle="Built for the way India works">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Against global imports</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>• Priced for India: about a third of many imported smart glasses.</li>
              <li>• Indian language packs & voice models tuned for accents and ambient noise.</li>
              <li>• Healthcare & Legal add-ons (optional) you won’t find in lifestyle-only products.</li>
              <li>• Data residency options and on-device redaction for sensitive work.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Specs that matter</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2">
              <li><b>Display:</b> Subtle heads-up indicators & audio prompts (no intrusive AR clutter).</li>
              <li><b>Audio:</b> Open-ear with beamforming mic; clear in noisy streets.</li>
              <li><b>Battery:</b> All-day typical use; USB-C quick charge.</li>
              <li><b>Connectivity:</b> Bluetooth-LE, Wi-Fi, companion app (iOS/Android).</li>
              <li><b>Controls:</b> Voice, touch tap, glance detection.</li>
              <li><b>Privacy:</b> Mute-switch, LED recording indicator, on-device filtering.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ====== PRICING ====== */}
      <Section id="pricing" title="Simple pricing" subtitle="Launch offer">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">ByOnco X</h3>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {formatINR(LAUNCH_PRICE)}{" "}
              <span className="ml-2 align-middle text-base font-medium text-slate-400 line-through">
                {formatINR(MSRP)}
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <li>• Includes charging cable, case, and getting-started guide</li>
              <li>• 6-month warranty (extendable to 12 months)</li>
              <li>• EMI & UPI supported • GST invoice</li>
            </ul>
            <Link
              to="/checkout/byonco-x"
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Pre-Order Now
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Add-ons</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li><b>Prescription lenses:</b> fulfilled via partner opticians. Pricing varies by power & material.</li>
              <li><b>Healthcare pack (soon):</b> visit summaries, meds reminders, caregiver mode.</li>
              <li><b>Legal pack (soon):</b> hearing transcripts, exhibit tags, precedent recall.</li>
              <li><b>Care+:</b> accidental damage protection & priority support.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ====== FAQ ====== */}
      <Section id="faq" title="FAQs" subtitle="Answers you’ll actually use">
        <div className="grid gap-4 md:grid-cols-2">
          <FAQItem
            q="How is this different from Meta Ray-Ban or JioFrames?"
            a={
              <>
                ByOnco X focuses on <b>work and care</b>, not just lifestyle content. You get multilingual
                transcription, recall, privacy controls, and sector-specific add-ons for healthcare and legal.
                It’s also <b>priced for India</b> with local payments, warranty, and support.
              </>
            }
          />
          <FAQItem
            q="Does it support Indian languages?"
            a="Yes. English plus Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Gujarati, Punjabi, Malayalam, and more for translation and voice commands."
          />
          <FAQItem
            q="Can I get prescription lenses?"
            a="Yes. Select 'Prescription' while ordering. Our team will contact you to collect your power and offer lens options via partner opticians."
          />
          <FAQItem
            q="What about privacy?"
            a="You control the mic and capture indicators. Sensitive content can be filtered on-device before anything is processed, and recordings show a visible LED."
          />
          <FAQItem
            q="When will it ship?"
            a="We plan to start deliveries across India in January 2026. Your pre-order is fully refundable until dispatch."
          />
          <FAQItem
            q="Which phones does it work with?"
            a="iOS and Android via the ByOnco companion app for setup, updates, and content export."
          />
        </div>
      </Section>

      {/* ====== CTA FOOTER ====== */}
      <div className="bg-[#ff4d00]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 text-white sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Let’s build the future of care together.
          </h3>
          <div className="flex items-center gap-4">
            <Link
              to="/checkout/byonco-x"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Pre-Order ByOnco X
            </Link>
            <a
              href="mailto:team@byoncocare.com"
              className="text-sm font-semibold underline underline-offset-4"
            >
              team@byoncocare.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
