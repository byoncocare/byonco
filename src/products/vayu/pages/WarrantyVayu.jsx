import React from "react";

export default function WarrantyVayu() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Vayu X Warranty Policy</h1>
      <p className="text-gray-500 mb-8">Transparent coverage for hardware and accessories.</p>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Coverage</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><b>12-month limited warranty</b> on Vayu X device and charging kit.</li>
          <li>Manufacturing defects and functional failures under normal use.</li>
          <li>Firmware/software updates provided during the warranty term.</li>
        </ul>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Exclusions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Accidental damage, liquid damage, cosmetic wear, or misuse.</li>
          <li>Third-party repairs, unauthorized modifications, or rooting/jailbreaking.</li>
          <li>Consumables (nose pads, frames) beyond manufacturing defects.</li>
        </ul>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">How to Claim</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Write to <a className="underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a> with order ID and issue.</li>
          <li>We’ll run remote diagnostics and arrange pickup if required.</li>
          <li>Repair or replacement will be provided per assessment.</li>
        </ol>
      </section>

      <p className="text-sm text-gray-500">
        Note: This policy aligns with Indian consumer protection norms. For commercial/enterprise deployments,
        additional SLA terms may apply.
      </p>
    </main>
  );
}
