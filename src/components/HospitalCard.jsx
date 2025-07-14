import React from 'react';
import { FaMapMarkerAlt, FaStethoscope, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function HospitalCard({ hospital }) {
  // Safely parse services: handles both string and array formats
  const servicesArray = Array.isArray(hospital.services)
    ? hospital.services
    : typeof hospital.services === 'string'
    ? hospital.services.split(/(?=[A-Z])/g).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-6 mb-6 w-full max-w-3xl mx-auto border border-gray-100 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hospital Name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{hospital.name}</h3>

      {/* Hospital Details */}
      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        {/* Location */}
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-pink-500 mt-1" />
          <span>
            <strong className="text-gray-800">Location:</strong> {hospital.location}
          </span>
        </div>

        {/* Services */}
        {servicesArray.length > 0 && (
          <div className="flex items-start gap-3 flex-wrap">
            <FaStethoscope className="text-purple-600 mt-1" />
            <div className="flex flex-wrap gap-2">
              <strong className="text-gray-800 w-full">Services:</strong>
              {servicesArray.map((service, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-md"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wait Time */}
        <div className="flex items-start gap-3">
          <FaClock className="text-blue-600 mt-1" />
          <span>
            <strong className="text-gray-800">Wait Time:</strong> {hospital.waitTime}
          </span>
        </div>

        {/* Cost */}
        <div className="flex items-start gap-3">
          <FaMoneyBillWave className="text-green-600 mt-1" />
          <span>
            <strong className="text-gray-800">Estimated Cost:</strong> {hospital.cost}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
