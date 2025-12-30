// src/products/vayu/components/order/CheckoutForm.jsx
import React from "react";
import { isValidEmail, isValidPhone, isValidPin, isNonEmpty } from "../../utils/validators";

export default function CheckoutForm({ values, errors, onChange, onSubmit, submitting, canSubmit }) {
  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    onChange(field, value);
  };

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {/* Contact */}
      <section aria-labelledby="checkout-contact">
        <h2
          id="checkout-contact"
          className="text-base font-semibold text-white mb-4"
        >
          Contact
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-white/80 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-white/80 mb-1">
              Phone (India)
            </label>
            <input
              id="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange("phone")}
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
              autoComplete="tel"
              required
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={values.emailUpdates}
              onChange={handleChange("emailUpdates")}
              className="rounded border-white/30 bg-black/60 text-[#1E5BFF] focus:ring-[#1E5BFF]"
            />
            Email me updates about Vayu.
          </label>
        </div>
      </section>

      {/* Delivery */}
      <section aria-labelledby="checkout-delivery">
        <h2
          id="checkout-delivery"
          className="text-base font-semibold text-white mb-4"
        >
          Delivery
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Country / Region</label>
            <select
              value={values.country}
              onChange={handleChange("country")}
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
            >
              <option value="India">India</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm text-white/80 mb-1">
                First name
              </label>
              <input
                id="firstName"
                value={values.firstName}
                onChange={handleChange("firstName")}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
                autoComplete="given-name"
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm text-white/80 mb-1">
                Last name
              </label>
              <input
                id="lastName"
                value={values.lastName}
                onChange={handleChange("lastName")}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
                autoComplete="family-name"
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm text-white/80 mb-1">
              Address line 1
            </label>
            <input
              id="address1"
              value={values.address1}
              onChange={handleChange("address1")}
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
              autoComplete="address-line1"
              required
            />
            {errors.address1 && (
              <p className="mt-1 text-xs text-red-400">{errors.address1}</p>
            )}
          </div>
          <div>
            <label htmlFor="address2" className="block text-sm text-white/80 mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              id="address2"
              value={values.address2}
              onChange={handleChange("address2")}
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
              autoComplete="address-line2"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-white/80 mb-1">
                City
              </label>
              <input
                id="city"
                value={values.city}
                onChange={handleChange("city")}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
                autoComplete="address-level2"
                required
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-400">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm text-white/80 mb-1">
                State
              </label>
              <input
                id="state"
                value={values.state}
                onChange={handleChange("state")}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
                autoComplete="address-level1"
                required
              />
              {errors.state && (
                <p className="mt-1 text-xs text-red-400">{errors.state}</p>
              )}
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm text-white/80 mb-1">
                PIN code
              </label>
              <input
                id="pin"
                value={values.pin}
                onChange={handleChange("pin")}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
                autoComplete="postal-code"
                required
              />
              {errors.pin && (
                <p className="mt-1 text-xs text-red-400">{errors.pin}</p>
              )}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={values.useShippingAsBilling}
              onChange={handleChange("useShippingAsBilling")}
              className="rounded border-white/30 bg-black/60 text-[#1E5BFF] focus:ring-[#1E5BFF]"
            />
            Use shipping address as billing address
          </label>
        </div>
      </section>

      {/* Shipping method */}
      <section aria-labelledby="checkout-shipping-method">
        <h2
          id="checkout-shipping-method"
          className="text-base font-semibold text-white mb-4"
        >
          Shipping method
        </h2>
        <div className="space-y-3 text-sm">
          {isNonEmpty(values.address1) &&
          isNonEmpty(values.city) &&
          isNonEmpty(values.state) &&
          isValidPin(values.pin) ? (
            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white/80">
              <div>
                <p className="font-medium text-sm">Standard Shipping</p>
                <p className="text-xs text-white/60">Delivers in 5–8 business days after dispatch.</p>
              </div>
              <p className="text-sm font-semibold text-white">Free</p>
            </div>
          ) : (
            <p className="text-xs text-white/60">
              Enter your full address to view available shipping methods.
            </p>
          )}
        </div>
      </section>

      {/* Payment */}
      <section aria-labelledby="checkout-payment">
        <h2
          id="checkout-payment"
          className="text-base font-semibold text-white mb-4"
        >
          Payment
        </h2>
        <div className="space-y-3 text-sm text-white/80">
          <p className="text-xs text-white/60">
            All transactions are processed securely via Razorpay. We never see or store your full card details.
          </p>
          <div className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">
              Pay securely via UPI, Cards, NetBanking, and Wallets.
            </p>
            <p className="text-xs text-white/60">
              You will review your payment details in Razorpay after confirming your order.
            </p>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-[#1E5BFF] rounded-full opacity-100" />
          <span className="relative bg-[#1E5BFF] group-hover:bg-[#2F6BFF] text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-colors">
            {submitting ? "Processing…" : "Pay now"}
          </span>
        </button>
        <p className="mt-2 text-[11px] text-white/40 text-center">
          By continuing, you agree to our Razorpay-powered checkout and Vayu policies.
        </p>
      </div>
    </form>
  );
}



