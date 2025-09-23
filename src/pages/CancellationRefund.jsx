import React from "react";

const CancellationRefund = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>
      <p className="mb-4">
        At ByOnco, we are committed to providing patients and caregivers with
        transparent and reliable healthcare services. However, due to the
        nature of healthcare and hospital bookings, certain services may not be
        eligible for cancellation or refund.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cancellations</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Consultation bookings can be cancelled up to 24 hours before the appointment.</li>
        <li>Lab test bookings can be cancelled up to 12 hours before the scheduled time.</li>
        <li>Hospital admission or bed booking cancellations depend on the hospital’s individual policy.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refunds</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Eligible cancellations will be refunded to the original payment method within 7–10 business days.</li>
        <li>Non-refundable charges include convenience fees and any third-party service fees.</li>
        <li>In case of failed transactions, the full amount will be auto-refunded within 5–7 business days.</li>
      </ul>

      <p className="mt-6">
        For assistance, please contact us at{" "}
        <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">
          contact@byoncocare.com
        </a>.
      </p>
    </div>
  );
};

export default CancellationRefund;
