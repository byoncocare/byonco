// src/pages/GetStarted.jsx
import React from 'react';

export default function GetStarted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Let’s Get You Started</h1>
        <p className="mb-6 text-gray-600">
          Begin your personalized cancer care journey with ByOnco. We’re here to help you find the right hospital and support.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-all duration-300">
          Book Consultation
        </button>
      </div>
    </div>
  );
}
