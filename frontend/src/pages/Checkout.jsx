import React from "react";
import { MapPin, Phone, ChevronDown, X, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf6f1", fontFamily: "Georgia, serif" }}
    >
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#3d2b1f" }}>
          Checkout
        </h1>
        <p className="text-stone-500 mb-8">Confirm your pickup details</p>

        <div className="space-y-6">
          {/* Location Section */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h2
                className="text-lg font-semibold mb-5"
                style={{ color: "#3d2b1f" }}
              >
                <MapPin className="inline mr-2 text-[#c0694e]" size={20} />
                Pickup Location
              </h2>

              {/* Location Dropdown */}
              <div className="relative mb-5">
                <select
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-[#faf6f1] px-4 py-3 pr-10 text-stone-700 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    fontFamily: "Georgia, serif",
                    focusRingColor: "#c0694e",
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a location...
                  </option>
                  {/* Populate via Google Places API */}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"
                  size={18}
                />
              </div>

              {/* Map Div */}
              <div
                id="checkout-map"
                className="w-full rounded-xl overflow-hidden"
                style={{
                  height: "280px",
                  backgroundColor: "#ede5dc",
                  border: "1px solid #e0d5c8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="text-center" style={{ color: "#a0856e" }}>
                  <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm opacity-60">Map will load here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Number Section */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h2
                className="text-lg font-semibold mb-5"
                style={{ color: "#3d2b1f" }}
              >
                <Phone className="inline mr-2 text-[#c0694e]" size={20} />
                Contact Number
              </h2>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-stone-200 bg-[#faf6f1] pl-11 pr-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              className="flex-1 py-4 rounded-xl border-2 font-semibold text-stone-600 transition-all hover:bg-stone-100"
              style={{ borderColor: "#d6c9bc", fontFamily: "Georgia, serif" }}
            >
              <X className="inline mr-2" size={18} />
              Cancel
            </button>
            <button
              className="flex-1 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-md"
              style={{
                backgroundColor: "#c0694e",
                fontFamily: "Georgia, serif",
              }}
            >
              <ShoppingBag className="inline mr-2" size={18} />
              Confirm Checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
