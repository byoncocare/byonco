import React from "react";

export default function CookiePolicyVayu() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Vayu X Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 02 Oct 2025</p>

      <section className="space-y-6">
        <p>
          We use cookies and similar tech in the Vayu website/portal to operate
          the site, remember preferences, and analyze usage.
        </p>

        <h2 className="text-xl font-semibold">1. Types</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Essential (auth, security, cart/preorder).</li>
          <li>Analytics/performance.</li>
          <li>Marketing (only with consent).</li>
        </ul>

        <h2 className="text-xl font-semibold">2. Managing Cookies</h2>
        <p>
          Use our banner to opt in/out of non-essential cookies or adjust your
          browser settings. Some features may be impacted if disabled.
        </p>

        <h2 className="text-xl font-semibold">3. Third-Party Cookies</h2>
        <p>
          Some third parties may set cookies subject to their policies (e.g.,
          analytics, payment gateways).
        </p>
      </section>
    </main>
  );
}
