import React from "react";

export default function ReturnsVayu() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">Refund policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 7, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-700 leading-relaxed">
            We have a 7-day return policy, which means you have 7 days after receiving your item to request a return for any reason.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">To be eligible for a return</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">To start a return</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To start a return, you can contact us at <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>. Please note that returns will need to be sent to the following address:
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              ITI Layout, Somasundarapalya<br />
              Bengaluru, Karnataka<br />
              India 560102
            </p>
            <p className="text-gray-700 leading-relaxed">
              If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Damages and issues</h2>
            <p className="text-gray-700 leading-relaxed">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Exceptions / non-returnable items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-gray-700 leading-relaxed">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We will notify you once we've received and inspected your return, and let you know if the refund has been approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If more than 15 business days have passed since we've approved your return, please contact us at <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Questions</h2>
            <p className="text-gray-700 leading-relaxed">
              You can always contact us for any return questions at <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
