import React from "react";

export default function ShippingInfoVayu() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">Shipping information</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 7, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery Timelines</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders are processed and shipped within 8 to 14 business days from the date of order confirmation. Delivery times may vary based on your location within India. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Standard delivery:</strong> 8–14 business days from order confirmation.</li>
              <li><strong>Metro cities:</strong> Typically 8–10 business days from order confirmation.</li>
              <li><strong>Non-metro/remote areas:</strong> Typically 10–14 business days from order confirmation.</li>
              <li><strong>Preorders:</strong> Ship according to your order confirmation window. Shipping starts March 2026.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping & Duties</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Standard shipping is included for deliveries within India.</li>
              <li>Expedited shipping options may be available for an additional charge.</li>
              <li>All prices displayed are inclusive of GST where applicable.</li>
              <li>For international orders, customs duties and import charges may apply and are the responsibility of the customer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your order is dispatched, tracking details will be emailed and/or sent via SMS to the contact information provided at checkout. You can use the tracking number to monitor your shipment's progress through our shipping partner's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Risk of Loss</h2>
            <p className="text-gray-700 leading-relaxed">
              Once we transfer products to the carrier, title and risk of loss passes to you. We recommend ensuring someone is available to receive the package at the delivery address to prevent loss or theft.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Questions</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about shipping? Write to <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a> or call us at <a href="tel:+919022792824" className="text-blue-600 underline">+91-902-2792-824</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
