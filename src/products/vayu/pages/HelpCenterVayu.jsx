import React from "react";
import { Link } from "react-router-dom";

export default function HelpCenterVayu() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Vayu X Help Center</h1>
          <p className="text-lg text-gray-600">
            Quick answers for setup, orders, troubleshooting, and more.
          </p>
        </header>

        {/* Quick links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <a href="#setup" className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-2">Setup & Pairing</h3>
            <p className="text-sm text-gray-600">Connect Vayu X to Vayu Hub and get started.</p>
          </a>
          <a href="#orders" className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-2">Orders & Preorders</h3>
            <p className="text-sm text-gray-600">Track, edit, or cancel orders.</p>
          </a>
          <a href="#troubleshoot" className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-2">Troubleshooting</h3>
            <p className="text-sm text-gray-600">Fix common issues and problems.</p>
          </a>
        </div>

        {/* Sections */}
        <section id="setup" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Setup & Pairing</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Initial Setup</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 leading-relaxed">
                <li>Charge the glasses for at least 60 minutes before first use using the included magnetic charger.</li>
                <li>Install Vayu Hub (available on iOS and Android) and sign in with your ByOnco account.</li>
                <li>Open Bluetooth settings on your device and select <strong>Vayu X</strong> to pair; confirm the pairing in Vayu Hub.</li>
                <li>Follow the in-app tutorial to calibrate voice settings and adjust display preferences.</li>
                <li>Complete the initial setup wizard to customize your experience.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Pairing Additional Devices</h3>
              <p className="text-gray-700 leading-relaxed">
                Vayu X can be paired with multiple devices. To pair with an additional device, open Vayu Hub on the new device, go to Settings, and select "Pair New Device". Follow the on-screen instructions.
              </p>
            </div>
          </div>
        </section>

        <section id="orders" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Orders & Preorders</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Order Tracking</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You'll receive email and/or SMS notifications with tracking information once your unit ships. Use the tracking number provided to monitor your shipment's progress.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Changing Your Order</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
                <li>You can change your shipping address within 12 hours of placing the order by contacting us at <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>.</li>
                <li>After 12 hours, changes may not be possible if your order has already entered the fulfillment process.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Cancellations</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                For cancellations and refunds, please see our <Link to="/products/vayu/refund-policy" className="text-blue-600 underline">Refund Policy</Link>. Pre-orders can be cancelled and are fully refundable until delivery.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Preorders</h3>
              <p className="text-gray-700 leading-relaxed">
                Vayu X starts shipping March 2026. Pre-orders are fully refundable until delivery. You will be notified via email when your order is ready to ship.
              </p>
            </div>
          </div>
        </section>

        <section id="troubleshoot" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Troubleshooting</h2>
          <div className="space-y-4">
            <details className="p-5 border-2 border-gray-200 rounded-lg mb-4">
              <summary className="font-semibold text-lg cursor-pointer">Device won't turn on</summary>
              <div className="mt-4 text-gray-700 leading-relaxed space-y-2">
                <p>Try the following steps:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Charge for at least 30 minutes using the included magnetic charger.</li>
                  <li>Long-press the power button for 5 seconds.</li>
                  <li>Check that the charger is properly connected and the charging indicator is showing.</li>
                  <li>If the issue persists, contact support.</li>
                </ol>
              </div>
            </details>
            <details className="p-5 border-2 border-gray-200 rounded-lg mb-4">
              <summary className="font-semibold text-lg cursor-pointer">Vayu Hub can't find device</summary>
              <div className="mt-4 text-gray-700 leading-relaxed space-y-2">
                <p>Try these troubleshooting steps:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Toggle Bluetooth off and on again on your device.</li>
                  <li>Restart Vayu Hub and ensure it has the latest version.</li>
                  <li>Make sure Vayu X is turned on and within range (within 10 meters).</li>
                  <li>Retry pairing from the Vayu Hub settings menu.</li>
                  <li>If issues continue, reset the Bluetooth connection on Vayu X (see device manual).</li>
                </ol>
              </div>
            </details>
            <details className="p-5 border-2 border-gray-200 rounded-lg mb-4">
              <summary className="font-semibold text-lg cursor-pointer">Display not clear or blurry</summary>
              <div className="mt-4 text-gray-700 leading-relaxed space-y-2">
                <p>Try these solutions:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Adjust display brightness and contrast settings in Vayu Hub.</li>
                  <li>Clean the lens gently with a microfiber cloth (never use harsh chemicals).</li>
                  <li>Check that you're wearing the glasses properly and they're positioned correctly.</li>
                  <li>Ensure the prescription lenses (if applicable) are correctly fitted.</li>
                </ol>
              </div>
            </details>
            <details className="p-5 border-2 border-gray-200 rounded-lg mb-4">
              <summary className="font-semibold text-lg cursor-pointer">Voice commands not working</summary>
              <div className="mt-4 text-gray-700 leading-relaxed space-y-2">
                <p>Try these steps:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Ensure the microphone is not obstructed or covered.</li>
                  <li>Re-calibrate voice settings in Vayu Hub.</li>
                  <li>Check that voice features are enabled in settings.</li>
                  <li>Speak clearly and at a moderate volume.</li>
                </ol>
              </div>
            </details>
            <details className="p-5 border-2 border-gray-200 rounded-lg mb-4">
              <summary className="font-semibold text-lg cursor-pointer">Battery draining quickly</summary>
              <div className="mt-4 text-gray-700 leading-relaxed space-y-2">
                <p>To improve battery life:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Reduce display brightness in Vayu Hub settings.</li>
                  <li>Disable features you're not actively using.</li>
                  <li>Ensure you're using the latest firmware version (check in Vayu Hub).</li>
                  <li>If battery life is significantly shorter than 12 hours, contact support as the battery may need servicing.</li>
                </ol>
              </div>
            </details>
          </div>
        </section>

        <section className="border-t-2 pt-12">
          <h2 className="text-2xl font-semibold mb-4">Need more help?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              Email: <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>
            </p>
            <p>
              Phone: <a href="tel:+919022792824" className="text-blue-600 underline">+91-902-2792-824</a>
            </p>
            <p className="mt-4">
              Address: ITI Layout, Somasundarapalya, Bengaluru, Karnataka, India 560102
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
