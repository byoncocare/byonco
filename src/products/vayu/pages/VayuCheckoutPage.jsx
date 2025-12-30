// src/products/vayu/pages/VayuCheckoutPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CheckoutForm from "../components/order/CheckoutForm";
import OrderSummary from "../components/order/OrderSummary";
import { loadCart, clearCart } from "../utils/cart";
import { applyCoupon } from "../utils/pricing";
import { isValidEmail, isValidPhone, isValidPin, isNonEmpty } from "../utils/validators";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://byonco-fastapi-backend.onrender.com";

export default function VayuCheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [values, setValues] = useState({
    email: "",
    phone: "",
    emailUpdates: false,
    country: "India",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
    useShippingAsBilling: true,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successState, setSuccessState] = useState(null);

  useEffect(() => {
    const stored = loadCart();
    if (stored && stored.items && stored.items.length > 0) {
      setCart(stored);
    }
  }, []);

  const lineItem = cart?.items?.[0];

  const pricing = useMemo(() => {
    if (!lineItem) return null;
    const subtotal = lineItem.unitPrice * lineItem.quantity;
    const shipping = 0;
    const { discount, finalTotal } = applyCoupon({ subtotal, couponCode });

    const compareAt = lineItem.compareAtPrice || 0;
    const totalSavingsRaw =
      compareAt > 0
        ? compareAt * lineItem.quantity - finalTotal
        : discount;

    return {
      subtotal,
      shipping,
      discount,
      total: finalTotal + shipping,
      totalSavings: totalSavingsRaw > 0 ? totalSavingsRaw : 0,
    };
  }, [lineItem, couponCode]);

  const validate = () => {
    const next = {};
    if (!isValidEmail(values.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(values.phone)) next.phone = "Enter a valid Indian mobile number.";
    if (!isNonEmpty(values.firstName)) next.firstName = "First name is required.";
    if (!isNonEmpty(values.lastName)) next.lastName = "Last name is required.";
    if (!isNonEmpty(values.address1)) next.address1 = "Address is required.";
    if (!isNonEmpty(values.city)) next.city = "City is required.";
    if (!isNonEmpty(values.state)) next.state = "State is required.";
    if (!isValidPin(values.pin)) next.pin = "Enter a valid 6‑digit PIN code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canSubmit = !!lineItem && !!pricing && Object.keys(errors).length === 0;

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // re-run validation lazily
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (!validate() || !lineItem || !pricing) return;
    setSubmitting(true);
    setSuccessState(null);

    try {
      // 1) Create order on backend
      const res = await fetch(`${BACKEND_URL}/api/payments/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          contact: {
            email: values.email,
            phone: values.phone,
          },
          shippingAddress: {
            country: values.country,
            firstName: values.firstName,
            lastName: values.lastName,
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            state: values.state,
            pin: values.pin,
          },
          couponCode,
        }),
      });

      if (!res.ok) {
        // Try to get error details from response
        let errorMessage = "Failed to create order. Please try again.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }
        console.error("Create order failed:", res.status, errorMessage);
        throw new Error(errorMessage);
      }
      const order = await res.json();

      // 2) Ensure Razorpay SDK is loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
          document.body.appendChild(script);
        });
      }

      // Backend returns amount in INR, but Razorpay needs paise (amount * 100)
      const amountInPaise = Math.round(order.amount * 100);

      const options = {
        key: order.keyId,
        amount: amountInPaise, // Convert INR to paise for Razorpay
        currency: order.currency || "INR",
        name: "Vayu X",
        description: "Vayu AI Glasses",
        order_id: order.razorpayOrderId,
        prefill: {
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          contact: values.phone,
        },
        theme: { color: "#1E5BFF" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${BACKEND_URL}/api/payments/razorpay/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  internalOrderId: order.orderId,
                }),
              }
            );

            if (!verifyRes.ok) {
              const errorData = await verifyRes.json().catch(() => ({}));
              throw new Error(errorData.detail || "Payment verification failed.");
            }
            
            const data = await verifyRes.json();
            clearCart();
            
            // Redirect to success page
            navigate(`/products/vayu/checkout/success?orderId=${encodeURIComponent(data.orderId || order.orderId)}`);
          } catch (err) {
            console.error("Payment verification error:", err);
            setSubmitting(false);
            setSuccessState({
              status: "error",
              message: err.message || "Payment captured but verification failed. Please contact support with your order ID.",
              orderId: order.orderId, // Show order ID even on error
            });
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setSubmitting(false);
        setSuccessState({
          status: "error",
          message: "Payment was not completed. You can try again.",
        });
      });
      rzp.open();
    } catch (err) {
      console.error("Payment submission error:", err);
      console.error("Backend URL:", BACKEND_URL);
      console.error("Request body:", {
        cart,
        contact: { email: values.email, phone: values.phone },
        shippingAddress: {
          country: values.country,
          firstName: values.firstName,
          lastName: values.lastName,
          address1: values.address1,
          city: values.city,
          state: values.state,
          pin: values.pin,
        },
        couponCode,
      });
      setSubmitting(false);
      setSuccessState({
        status: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="page-shell min-h-screen bg-gradient-to-b from-black via-[#020617] to-black text-white">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
            {/* Left: form */}
            <section aria-label="Checkout form">
              {lineItem ? (
                <CheckoutForm
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  canSubmit={canSubmit}
                />
              ) : (
                <p className="text-sm text-white/70">
                  Your Vayu cart is empty. Go back to the product page to start an order.
                </p>
              )}

              {successState && (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                    successState.status === "success"
                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                      : "border-red-500/60 bg-red-500/10 text-red-100"
                  }`}
                >
                  {successState.status === "success" ? (
                    <>
                      <p className="font-semibold mb-1">Order confirmed.</p>
                      <p>
                        Your payment was successful. Your Vayu order ID is{" "}
                        <span className="font-mono text-xs">
                          {successState.orderId}
                        </span>
                        .
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold mb-1">Something went wrong.</p>
                      <p>{successState.message}</p>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Right: summary */}
            <section aria-label="Order summary">
              {lineItem && pricing && (
                <OrderSummary
                  item={lineItem}
                  couponCode={couponCode}
                  onCouponChange={setCouponCode}
                  pricing={pricing}
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


