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
          <h1 id="cookies-title" className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
            Cookies
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl">
            We use limited, privacy-respecting cookies to run the site and understand usage.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-4 text-muted-foreground">
          <p>
            Essential cookies keep you signed in and deliver core features for the Vayu X experience. Optional analytics
            cookies help us improve product quality. Marketing cookies are only used with your consent.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Managing Cookies</h2>
          <p>
            Use the cookie banner to opt in/out of non-essential cookies, or control cookies via your browser settings.
            Some features may be impacted if disabled.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Third-Party Cookies</h2>
          <p>
            Certain third parties (e.g., analytics, payment gateways) may set cookies subject to their own policies.
          </p>

          <p>
            Questions? Write to{" "}
            <a className="underline" href="mailto:contact@byoncocare.com">
              contact@byoncocare.com
            </a>
            . See also our{" "}
            <a className="underline" href="/products/vayu/privacy-policy">
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-sm opacity-70">Last updated: 02 Oct 2025</p>
        </div>
      </section>
    </main>
  );
}
