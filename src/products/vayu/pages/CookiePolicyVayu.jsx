// ByOnco/src/products/vayu/pages/CookiePolicyVayu.jsx
import React from "react";

export default function CookiePolicyVayu() {
  return (
    <main
      className="min-h-screen bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      aria-labelledby="cookies-title"
    >
      {/* Hero (Praesidio-style visual) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16">
          <h1
            id="cookies-title"
            className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
          >
            Cookies
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl">
            We use limited, privacy-respecting cookies to run the site and
            understand usage.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6 text-muted-foreground">
          {/* What & why */}
          <p>
            Cookies are small text files stored on your device. We use them on
            the Vayu X website/portal to operate core features, remember basic
            preferences, and measure usage so we can improve the product.
          </p>

          {/* Types */}
          <section aria-labelledby="cookie-types">
            <h2
              id="cookie-types"
              className="text-xl font-semibold text-foreground"
            >
              Types of Cookies We Use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-foreground">Essential:</span>{" "}
                Required for sign-in, security, and basic functionality.
              </li>
              <li>
                <span className="font-medium text-foreground">Analytics:</span>{" "}
                Anonymous usage analytics that help us understand performance and
                improve features.
              </li>
              <li>
                <span className="font-medium text-foreground">Marketing:</span>{" "}
                Measurement/remarketing cookies (used only if you consent).
              </li>
            </ul>
          </section>

          {/* Managing */}
          <section aria-labelledby="manage-cookies">
            <h2
              id="manage-cookies"
              className="text-xl font-semibold text-foreground"
            >
              Managing Your Preferences
            </h2>
            <p>
              Use the cookie banner to accept, decline, or adjust non-essential
              cookies in <span className="font-medium">Cookie Settings</span>.
              You can also control or clear cookies in your browser settings.
              Disabling some cookies may affect certain features.
            </p>
          </section>

          {/* Third party */}
          <section aria-labelledby="third-party">
            <h2
              id="third-party"
              className="text-xl font-semibold text-foreground"
            >
              Third-Party Cookies
            </h2>
            <p>
              Third parties (for example, analytics providers or payment
              gateways) may set cookies according to their own privacy policies.
            </p>
          </section>

          {/* Contact + links */}
          <section aria-labelledby="contact-links">
            <h2
              id="contact-links"
              className="text-xl font-semibold text-foreground"
            >
              Questions & Links
            </h2>
            <p>
              Questions? Write to{" "}
              <a className="underline" href="mailto:contact@byoncocare.com">
                contact@byoncocare.com
              </a>
              . See also our{" "}
              <a
                className="underline"
                href="/products/vayu/privacy-policy"
              >
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-sm opacity-70">Last updated: 02 Oct 2025</p>
          </section>
        </div>
      </section>
    </main>
  );
}
