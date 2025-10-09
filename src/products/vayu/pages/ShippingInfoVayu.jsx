import React from "react";

export default function ShippingInfoVayu() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Vayu X Shipping Information</h1>
      <p className="text-gray-500 mb-8">Timelines, charges, and tracking.</p>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Delivery Timelines</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Metro cities: 3–5 business days after dispatch.</li>
          <li>Non-metro/remote: 5–9 business days.</li>
          <li>Preorders ship according to your order confirmation window.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Shipping & Duties</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Standard shipping is included for India; expedited options may be chargeable.</li>
          <li>All prices are inclusive of GST where applicable.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Tracking</h2>
        <p>Tracking details will be emailed/SMS’d once your order is dispatched.</p>
      </section>

      <p className="text-sm text-gray-500">
        Questions? Write to <a className="underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a>.
      </p>
    </main>
  );
}
