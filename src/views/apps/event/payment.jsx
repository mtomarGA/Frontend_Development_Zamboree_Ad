"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  ChevronRight,
  X,
  User,
  Zap,
  Shield
} from "lucide-react";

export default function CustomPayment() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  // ✅ Payment categories
  const paymentCategories = [
    {
      id: "cardless",
      name: "Cardless and Others",
      methods: [
        { id: "upi", name: "UPI", icon: Smartphone, logos: ["📱"] },
        { id: "wallet", name: "Wallets", icon: Wallet, logos: ["💰"] }
      ]
    },
    {
      id: "emi",
      name: "EMI",
      methods: [
        { id: "card-emi", name: "Card EMI", icon: CreditCard, logos: ["💳"] },
        { id: "cardless-emi", name: "Cardless EMI", icon: Zap, logos: ["⚡"] }
      ]
    },
    {
      id: "netbanking",
      name: "Netbanking",
      methods: [
        { id: "netbanking", name: "All Banks", icon: Building2, logos: ["🏦"] }
      ]
    },
    {
      id: "paylater",
      name: "Pay Later",
      methods: [
        { id: "paylater", name: "Pay Later Options", icon: Zap, logos: ["⏰"] }
      ]
    }
  ];

  // ✅ Create order from backend
  const createOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/user/event/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Eventid: "690451c7fb4ec420cd72d45d",
          quantity: 1,
          Ticketid: "6909e4ffe1f158bc8731defe",
          bookeddate: "2025-11-07T06:04:30.000+00:00",
          paid_via: "Razorpay"
        })
      });

      const data = await res.json();
      if (data?.id) {
        setOrder(data);
        setShowPaymentModal(true);
      } else {
        alert("Order creation failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle custom payment (no Razorpay popup)
  const processPayment = async (methodType) => {
    if (!order?.id) {
      alert("Order not ready.");
      return;
    }

    setLoading(true);
    setPaymentStatus("Processing...");

    try {
      if (methodType === "upi") {
        // Example for UPI flow
        const upiId = prompt("Enter your UPI ID (e.g. username@okaxis):");
        if (!upiId) {
          setPaymentStatus("Payment cancelled.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/user/event/pay-upi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: order.id,
            vpa: upiId,
            amount: order.amount / 100
          })
        });

        const data = await res.json();

        if (res.ok && data?.status) {
          setPaymentStatus(`Payment ${data.status.toUpperCase()}`);
          if (data.status === "created" || data.status === "authorized") {
            alert(
              "Payment request sent! Please approve it in your UPI app."
            );
          }
        } else {
          setPaymentStatus("Payment failed. Try again.");
        }
      } else {
        // Handle other methods or show message
        alert("This payment method requires redirect (not supported headless).");
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus("Error initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Button */}
      {!showPaymentModal && (
        <button
          onClick={createOrder}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
        >
          {loading ? "Creating Order..." : "Start Payment"}
        </button>
      )}

      {/* Custom Modal */}
      {showPaymentModal && order && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex">
            {/* Left Side */}
            <div className="w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold">Event Payment</h2>
              </div>

              <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6 backdrop-blur">
                <p className="text-indigo-200 text-sm mb-2">Price Summary</p>
                <p className="text-4xl font-bold">₹{order.amount / 100}</p>
              </div>

              <div className="bg-white bg-opacity-20 rounded-xl p-4 flex items-center gap-3 mb-auto">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-90">Using as</p>
                  <p className="font-semibold">+91 99999 99999</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto" />
              </div>

              <div className="mt-auto pt-8 border-t border-white border-opacity-20">
                <div className="flex items-center gap-2 text-sm opacity-75">
                  <Shield className="w-4 h-4" />
                  <p>Secured via Razorpay API</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="w-3/5 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedCategory
                    ? paymentCategories.find((c) => c.id === selectedCategory)
                      ?.name
                    : "Payment Options"}
                </h3>
                <button
                  onClick={() => {
                    if (selectedCategory) {
                      setSelectedCategory(null);
                      setSelectedMethod(null);
                    } else {
                      setShowPaymentModal(false);
                      setOrder(null);
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!selectedCategory ? (
                  // Category list
                  <div className="space-y-3">
                    {paymentCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            {/* <category.meythods[0].icon className="w-6 h-6 text-indigo-600" /> */}
                          </div>
                          <span className="font-medium text-gray-800">
                            {category.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  // Method list
                  <div className="space-y-3">
                    {paymentCategories
                      .find((c) => c.id === selectedCategory)
                      ?.methods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            onClick={() => {
                              setSelectedMethod(method.id);
                              processPayment(method.id);
                            }}
                            disabled={loading}
                            className="w-full flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                <Icon className="w-7 h-7 text-indigo-600" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">
                                  {method.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Fast & Secure
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {method.logos.map((logo, idx) => (
                                <span key={idx} className="text-2xl">
                                  {logo}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}

                {paymentStatus && (
                  <div className="mt-6 flex items-center justify-center gap-3 p-6 bg-indigo-50 rounded-xl">
                    <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />
                    <p className="text-indigo-600 font-medium">{paymentStatus}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <p>Your payment is secure and encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
