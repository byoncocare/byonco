// src/products/vayu/pages/VayuCheckoutSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function VayuCheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear any cart data on success page
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("vayu_cart");
    }
  }, []);

  return (
    <div className="page-shell min-h-screen bg-gradient-to-b from-black via-[#020617] to-black text-white">
      <Navbar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-500/20 p-6 border border-emerald-500/30">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Order Confirmed
              </h1>
              <p className="text-lg text-white/70 max-w-md mx-auto">
                Thank you for your order! Your payment was successful and your Vayu AI Glasses are on the way.
              </p>
            </div>

            {/* Order ID */}
            {orderId && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                <p className="text-sm text-white/50 uppercase tracking-wider">
                  Order ID
                </p>
                <p className="text-xl font-mono font-semibold text-white">
                  {orderId}
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <h2 className="text-lg font-semibold">What's Next?</h2>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>
                    You'll receive an order confirmation email shortly with all the details.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>
                    Orders start shipping in March 2026. We'll notify you when your order ships.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>
                    Your order is fully refundable until delivery. 6-month warranty included.
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate("/products/vayu")}
                className="px-6 py-3 bg-white hover:bg-white/90 text-black rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/products/vayu/help-center")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20"
              >
                Help Center
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


