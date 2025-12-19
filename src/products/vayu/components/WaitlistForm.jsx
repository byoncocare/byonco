import React, { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdkwbqoz";

// Pull UTM/source params if present
function readUTM() {
  if (typeof window === "undefined") return {};
  const u = new URL(window.location.href);
  const pick = (k) => u.searchParams.get(k) || "";
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    referrer: document.referrer || "",
  };
}

// Simple required check
const isRequired = (v) => (typeof v === "string" ? v.trim().length > 0 : !!v);

export default function WaitlistForm() {
  const [shippingDifferent, setShippingDifferent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const wantsShipDiff = fd.get("shippingDifferent") === "on";

    // Required fields
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "addressLine1",
      "country",
      "state",
      "zip",
      "edition",
      "profession",
      "reasonCategory",
    ];
    if (wantsShipDiff) {
      required.push("s_addressLine1", "s_country", "s_state", "s_zip");
    }

    for (const k of required) {
      if (!isRequired(data[k])) {
        setSubmitting(false);
        setError("Please fill all required fields.");
        return;
      }
    }

    // If "Other" selected, require a note
    if (data.reasonCategory === "other" && !isRequired(data.reasonDetails)) {
      setSubmitting(false);
      setError('Please add a short note under "If Other or additional context".');
      return;
    }

    // Email & phone format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setSubmitting(false);
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(data.phone)) {
      setSubmitting(false);
      setError("Use an international phone format, e.g., +91 98XXXXXXXX.");
      return;
    }

    const payload = {
      _subject: "New VAYU X Waitlist submission",
      _replyto: data.email,
      form: "vayu-x-waitlist",
      ...data,
      shippingDifferent: wantsShipDiff,
      prescription: fd.get("prescription") === "on",
      _page: typeof window !== "undefined" ? window.location.href : "",
      ...readUTM(),
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit failed. Please try again.");
      setSuccess(true);
      e.currentTarget.reset();
      setShippingDifferent(false);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-emerald-800">You’re on the list 🎉</h2>
        <p className="mt-3 text-emerald-900">
          Thanks for your interest in <strong>Vayu X</strong>. Our team will reach out to you soon
          with next steps.
        </p>
        <a
          href="/products/vayu"
          className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-white bg-emerald-600 hover:bg-emerald-700 shadow"
        >
          ← Back to Vayu X
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl glass-panel"
      noValidate
    >
      {/* Header stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-[#1E5BFF] via-[#2F6BFF] to-[#1E5BFF] rounded-t-2xl" />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
        {/* Honeypot (spam trap) */}
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

        {/* Contact */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-white">Contact Details</h2>
          <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Field label="First Name*" name="firstName" autoComplete="given-name" />
            <Field label="Last Name*" name="lastName" autoComplete="family-name" />
            <Field
              label="Email*"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <Field
              label="Phone (with country code)*"
              name="phone"
              placeholder="+91 98XXXXXXXX"
              autoComplete="tel"
              inputMode="tel"
              pattern="^\+?[0-9\s\-()]{7,20}$"
            />
          </div>
        </section>

        {/* Address */}
        <section>
          <h2 className="text-lg font-semibold text-white">Address</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Address Line 1*"
              name="addressLine1"
              className="md:col-span-2"
              autoComplete="address-line1"
            />
            <Field
              label="Address Line 2 (optional)"
              name="addressLine2"
              className="md:col-span-2"
              autoComplete="address-line2"
            />
            <Field label="Country*" name="country" placeholder="India" autoComplete="country-name" />
            <Field
              label="State/Province*"
              name="state"
              placeholder="Maharashtra"
              autoComplete="address-level1"
            />
            <Field label="City (optional)" name="city" autoComplete="address-level2" />
            <Field label="ZIP / Postal Code*" name="zip" autoComplete="postal-code" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              id="shippingDifferent"
              name="shippingDifferent"
              type="checkbox"
              onChange={(e) => setShippingDifferent(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="shippingDifferent" className="text-sm text-white/70">
              Shipping address is different
            </label>
          </div>

          {shippingDifferent && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
              <Field
                label="Shipping Address Line 1*"
                name="s_addressLine1"
                className="md:col-span-2"
                autoComplete="address-line1"
              />
              <Field
                label="Shipping Address Line 2 (optional)"
                name="s_addressLine2"
                className="md:col-span-2"
                autoComplete="address-line2"
              />
              <Field label="Country*" name="s_country" autoComplete="country-name" />
              <Field label="State/Province*" name="s_state" autoComplete="address-level1" />
              <Field label="City (optional)" name="s_city" autoComplete="address-level2" />
              <Field label="ZIP / Postal Code*" name="s_zip" autoComplete="postal-code" />
            </div>
          )}
        </section>

        {/* Product & Intent */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-white">Your Selection</h2>
          <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70">
                Which edition do you need?*{" "}
                <span className="text-xs text-white/50">(Shipping now: Essential only)</span>
              </label>
              <select
                name="edition"
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2 focus:border-[#1E5BFF] focus:ring-[#1E5BFF] backdrop-blur-sm [&>option]:bg-[#1a1a2e] [&>option]:text-white"
                defaultValue=""
              >
                <option value="" disabled className="bg-[#1a1a2e] text-white">
                  Select edition
                </option>
                <option value="Essential" className="bg-[#1a1a2e] text-white">Vayu X Essential (available now)</option>
                <option value="ProMed" className="bg-[#1a1a2e] text-white">Vayu X ProMed (waitlist)</option>
                <option value="LegalEdge" className="bg-[#1a1a2e] text-white">Vayu X LegalEdge (waitlist)</option>
              </select>
            </div>

            <Field
              label="Profession*"
              name="profession"
              placeholder="e.g., Doctor, Engineer, Lawyer"
              autoComplete="organization-title"
            />

            <div className="flex items-center gap-3">
              <input
                id="prescription"
                name="prescription"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="prescription" className="text-sm text-white/70">
                Glasses with prescription lenses
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">Reason for purchase*</label>
              <select
                name="reasonCategory"
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2 focus:border-[#1E5BFF] focus:ring-[#1E5BFF] backdrop-blur-sm [&>option]:bg-[#1a1a2e] [&>option]:text-white"
                defaultValue=""
              >
                <option value="" disabled className="bg-[#1a1a2e] text-white">
                  Select one
                </option>
                <option value="future-trends" className="bg-[#1a1a2e] text-white">Interested in future trends</option>
                <option value="work-purpose" className="bg-[#1a1a2e] text-white">Need it for work purpose</option>
                <option value="other" className="bg-[#1a1a2e] text-white">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70">
                If “Other” or additional context (optional)
              </label>
              <textarea
                name="reasonDetails"
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600"
                placeholder="Share a brief note (optional)"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <p className="text-xs sm:text-sm text-white/60">
            By submitting, you agree to be contacted for order &amp; shipping coordination.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(30,91,255,0.3)] disabled:opacity-60 w-full md:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#1E5BFF] to-[#2F6BFF] opacity-100 rounded-full"></span>
            <span className="relative bg-[#1E5BFF] group-hover:bg-[#2F6BFF] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors z-10 w-full md:w-auto">
              {submitting ? "Submitting…" : "Join the Waitlist"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

/** Reusable input field */
function Field({ label, name, type = "text", className = "", ...rest }) {
  const required = /\*/.test(label);
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2
                   focus:border-[#1E5BFF] focus:ring-[#1E5BFF] placeholder:text-white/40 backdrop-blur-sm"
        {...rest}
      />
    </div>
  );
}
