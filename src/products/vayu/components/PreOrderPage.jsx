// src/products/vayu/components/PreOrderPage.jsx
import React, { useState } from "react";
import { ArrowLeft, Check, Star, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { productVariants, faqData } from "../data/mock";

// ⬇️ Use the new lightweight accordion
import { Accordion } from "../components/AccordionLite";

const PreOrderPage = ({ onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState("healthcare");
  const [lensType, setLensType] = useState("non-prescription");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const selectedProduct = productVariants.find((p) => p.id === selectedVariant);

  const handlePreOrder = () => {
    // Mock pre-order functionality
    alert(
      `Pre-order placed for ${selectedProduct.name}! You'll receive a confirmation email soon.`
    );
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Product Selection */}
          <div className="space-y-6">
            {/* Product Images */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/vayu/preorder-front.jpg"
                    alt="Vayu glasses front view"
                    className="w-full rounded-lg"
                  />
                  <img
                    src="/vayu/preorder-side.jpg"
                    alt="Vayu glasses side view"
                    className="w-full rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Vayu Model</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
                  {productVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={variant.id} id={variant.id} />
                      <Label htmlFor={variant.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {variant.name}
                              {variant.popular && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  Most Popular
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{variant.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{variant.targetAudience}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              ₹{variant.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{variant.originalPrice.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Lens Type */}
            <Card>
              <CardHeader>
                <CardTitle>Lens Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={lensType} onValueChange={setLensType}>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="non-prescription" id="non-prescription" />
                    <Label htmlFor="non-prescription" className="cursor-pointer">
                      Non-prescription (Clear lenses)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="prescription" id="prescription" />
                    <Label htmlFor="prescription" className="cursor-pointer">
                      Prescription (Submit details after order)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{selectedProduct.name}</span>
                  <span className="font-bold">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Lens Type</span>
                  <span className="capitalize">{lensType.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                </div>

                {/* Features List */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Included Features:</h4>
                  <ul className="space-y-1">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your shipping address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-6 h-6 text-green-600 mb-1" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs text-gray-600">Prescription Compatible</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-6 h-6 text-purple-600 mb-1" />
                    <span className="text-xs text-gray-600">Full Refund</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="w-6 h-6 text-yellow-600 mb-1" />
                    <span className="text-xs text-gray-600">Warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pre-Order Button */}
            <Button
              onClick={handlePreOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
            >
              Pre-Order for ₹{selectedProduct.price.toLocaleString("en-IN")}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Fully refundable until delivery. Shipping starts March 2026.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          {/* Same animated look/feel as the main Vayu page */}
          <Accordion
            items={faqData}
            defaultOpen={0}                 // first question open
            multiple={false}                // single-open behavior
            className="bg-gray-50 rounded-2xl p-8"
          />
        </section>
      </div>
    </div>
  );
};

export default PreOrderPage;
