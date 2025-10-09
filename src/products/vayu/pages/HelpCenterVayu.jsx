import React from "react";

export default function HelpCenterVayu() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Vayu X Help Center</h1>
        <p className="text-gray-500 mt-2">
          Quick answers for setup, orders, and troubleshooting.
        </p>
      </header>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <a href="#setup" className="p-5 rounded-xl border border-gray-200 hover:shadow">
          <h3 className="font-semibold">Setup & Pairing</h3>
          <p className="text-sm text-gray-500 mt-1">Connect Vayu X to the app.</p>
        </a>
        <a href="#orders" className="p-5 rounded-xl border border-gray-200 hover:shadow">
          <h3 className="font-semibold">Orders & Preorders</h3>
          <p className="text-sm text-gray-500 mt-1">Track, edit, or cancel orders.</p>
        </a>
        <a href="#troubleshoot" className="p-5 rounded-xl border border-gray-200 hover:shadow">
          <h3 className="font-semibold">Troubleshooting</h3>
          <p className="text-sm text-gray-500 mt-1">Fix common issues.</p>
        </a>
      </div>

      {/* Sections */}
      <section id="setup" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Setup & Pairing</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Charge the glasses for 60 minutes before first use.</li>
          <li>Install the Vayu X app and sign in with your ByOnco account.</li>
          <li>Open Bluetooth &amp; select <b>Vayu X</b> to pair; confirm in the app.</li>
          <li>Follow the in-app tutorial to calibrate camera and voice.</li>
        </ol>
      </section>

      <section id="orders" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Orders & Preorders</h2>
        <p className="mb-2">You’ll receive email/SMS with tracking once your unit ships.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Change address within 12 hours of placing the order.</li>
          <li>For cancellations, see <a className="underline" href="/cancellation-refund">Cancellation &amp; Refunds</a>.</li>
        </ul>
      </section>

      <section id="troubleshoot" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <details className="p-4 border rounded-lg mb-3">
          <summary className="font-medium">Device won’t turn on</summary>
          <p className="mt-3 text-gray-600">Charge for 30 minutes and long-press power for 5 seconds.</p>
        </details>
        <details className="p-4 border rounded-lg mb-3">
          <summary className="font-medium">App can’t find device</summary>
          <p className="mt-3 text-gray-600">Toggle Bluetooth, restart the app, and retry pairing.</p>
        </details>
        <details className="p-4 border rounded-lg">
          <summary className="font-medium">Lens/OCR not accurate</summary>
          <p className="mt-3 text-gray-600">Run calibration in Settings → Vision and clean the lens gently.</p>
        </details>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-2">Need more help?</h2>
        <p>
          Email <a className="underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a> or call{" "}
          <a className="underline" href="tel:+919022792824">+91-902-2792-824</a>.
        </p>
      </section>
    </main>
  );
}
