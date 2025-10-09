import React from "react";

export default function ReturnsVayu() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Vayu X Returns & Refunds</h1>
      <p className="text-gray-500 mb-8">Simple and fair return timelines.</p>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Return Window</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><b>7-day return</b> from delivery if the product is unused and in original condition.</li>
          <li>Defective on arrival? We prioritize replacement or full refund after inspection.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Eligibility</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Include all accessories, manuals, and packaging.</li>
          <li>No signs of wear, damage, or unauthorized repair.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">How to Request</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact support at <a className="underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a>.</li>
          <li>Arrange pickup through our logistics partner.</li>
          <li>Refunds are issued to the original payment method within 5–7 business days after QC.</li>
        </ol>
      </section>

      <p className="text-sm text-gray-500">
        Also see our general <a className="underline" href="/cancellation-refund">Cancellation &amp; Refund Policy</a>.
      </p>
    </main>
  );
}
