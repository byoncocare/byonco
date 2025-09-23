import React from "react";

const ShippingDelivery = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Shipping and Delivery Policy</h1>
      <p className="mb-4">
        ByOnco primarily provides healthcare discovery and digital services.
        However, in cases where physical reports, medicines, or related
        healthcare items are shipped, the following policy applies:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Timeline</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Digital reports are delivered instantly via email or app notification.</li>
        <li>Physical reports or documents are usually delivered within 3–7 working days.</li>
        <li>Medicines (if applicable) are delivered as per pharmacy partner timelines (generally 2–5 working days).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Charges</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Standard shipping charges apply as displayed at checkout.</li>
        <li>Free delivery may be available on select services or promotional offers.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Tracking</h2>
      <p>
        Once shipped, you will receive tracking details via SMS or email.
      </p>

      <p className="mt-6">
        For support regarding shipping and delivery, contact us at{" "}
        <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">
          contact@byoncocare.com
        </a>.
      </p>
    </div>
  );
};

export default ShippingDelivery;
