// src/pages/JoinWaitlist.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function JoinWaitlist() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    help: '',
    disease: '',
    customDisease: '',
    priority: 'Normal',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const { name, phone, city, help, disease, customDisease } = form;
    return (
      name.trim() &&
      phone.trim() &&
      city.trim() &&
      help.trim() &&
      disease &&
      (disease !== 'Other' || customDisease.trim())
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const finalForm = {
      ...form,
      disease:
        form.disease === 'Other'
          ? form.customDisease.trim() || 'Other'
          : form.disease,
    };

    console.log('✅ Submitted:', finalForm);

    setSubmitted(true);
    setForm({
      name: '',
      phone: '',
      city: '',
      help: '',
      disease: '',
      customDisease: '',
      priority: 'Normal',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#05f58d] to-[#e0fff1] py-12 px-4 flex justify-center items-start">
      <motion.div
        className="w-full max-w-3xl bg-white shadow-xl border border-gray-200 rounded-2xl p-8 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6">
          Join the ByOnco Pilot Waitlist
        </h1>

        <p className="text-gray-700 text-center text-base sm:text-lg mb-8 leading-relaxed">
          We’re currently running our pilot program across Tier 1, Tier 2, and Tier 3 cities.
          Thousands of patients have already received help from us. Hundreds of doctors are already in touch.
          <br />
          <span className="font-semibold text-blue-600">
            We currently respond through WhatsApp & Phone.
          </span>
        </p>

        {submitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            🎉 Thank you for joining! We would reach out to you at the earliest.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Yuvraj Yograj Singh"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">City</label>
            <input
              type="text"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Nashik / Mumbai / Pune"
            />
          </div>

          {/* Disease Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Disease Type</label>
            <select
              name="disease"
              value={form.disease}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            >
              <option value="">Select a disease type</option>
              <option value="Breast Cancer">Breast Cancer</option>
              <option value="Lung Cancer">Lung Cancer</option>
              <option value="Oral Cancer">Oral Cancer</option>
              <option value="Blood Cancer (Leukemia)">Blood Cancer (Leukemia)</option>
              <option value="Stomach Cancer">Stomach Cancer</option>
              <option value="Cervical Cancer">Cervical Cancer</option>
              <option value="Colon Cancer">Colon Cancer</option>
              <option value="Liver Cancer">Liver Cancer</option>
              <option value="Prostate Cancer">Prostate Cancer</option>
              <option value="Other">Other</option>
            </select>
            {form.disease === 'Other' && (
              <input
                type="text"
                name="customDisease"
                value={form.customDisease}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Please specify"
              />
            )}
          </div>

          {/* Help Needed */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">What help do you need?</label>
            <textarea
              name="help"
              required
              value={form.help}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder="Tell us how we can support you (e.g., financial help, hospital match, consultation)..."
            ></textarea>
          </div>

          {/* Priority */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            >
              <option value="Normal">Normal</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-lg font-semibold transition shadow ${
                isFormValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Join Waitlist via WhatsApp
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
