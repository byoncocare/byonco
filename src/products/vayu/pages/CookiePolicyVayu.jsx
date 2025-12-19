import React from "react";
import { Link } from "react-router-dom";

export default function CookiePolicyVayu() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">Cookie policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 7, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device. We use them on the Vayu X website/portal to operate core features, remember basic preferences, and measure usage so we can improve the product.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>
                <strong>Essential:</strong> Required for sign-in, security, and basic functionality. These cookies are necessary for the website to function and cannot be switched off in our systems.
              </li>
              <li>
                <strong>Analytics:</strong> Anonymous usage analytics that help us understand performance and improve features. These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
              </li>
              <li>
                <strong>Marketing:</strong> Measurement/remarketing cookies (used only if you consent). These cookies may be set through our site by our advertising partners and may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Your Preferences</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control or clear cookies in your browser settings at any time. Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please note that if you delete or refuse to accept cookies, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Third parties (for example, analytics providers, payment gateways, or advertising networks) may set cookies according to their own privacy policies. These cookies enable third-party features or functionality to be provided on or through the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Questions & Links</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Questions about our use of cookies? Write to <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">contact@byoncocare.com</a>. See also our <Link to="/products/vayu/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link> for more information about how we collect, use, and disclose your personal information.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
