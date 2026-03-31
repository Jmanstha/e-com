import React, { useEffect, useRef, useState } from "react";
import { MapPin, Phone, ChevronDown, X, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { cartService } from "@/services/cartService";

export default function CheckoutPage() {
  const selectedLocation = useStore((state) => state.selectedLocation);
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);

  const phoneNumber = useStore((state) => state.phoneNumber);
  const setPhoneNumber = useStore((state) => state.setPhoneNumber);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const handlePayment = useStore((state) => state.handlePayment);

  const orderId = useStore((state) => state.orderId);

  const handlePlaceOrder = useStore((state) => state.handlePlaceOrder);
  const setOrderId = useStore((state) => state.setOrderId);

  const [total, setTotal] = useState();

  const fetchCartTotal = async () => {
    const total = await cartService.getCartsTotal();
    setTotal(total);
    return total;
  };
  const handleOrder = async () => {
    const order_id = await handlePlaceOrder({
      phone_number: phoneNumber,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      address: selectedLocation.address,
    });
    setOrderId(order_id);
    localStorage.setItem("pending_order_id", order_id);
    console.log("Logged at checkout", orderId);
    return order_id;
  };

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("checkout-map").setView([27.7172, 85.324], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      );
      const data = await res.json();

      setSelectedLocation({
        lat,
        lng,
        address: data.display_name,
      });
    });

    mapRef.current = map;
  }, [setSelectedLocation]);

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

              {/* Map */}
              <div className="relative" style={{ zIndex: 0 }}>
                <div
                  id="checkout-map"
                  className="w-full rounded-xl overflow-hidden mb-5"
                  style={{
                    height: "280px",
                    border: "1px solid #e0d5c8",
                  }}
                />
              </div>

              {/* Selected Location Display */}
              {selectedLocation ? (
                <div
                  className="rounded-xl px-4 py-3 text-sm text-stone-700"
                  style={{ backgroundColor: "#f0e9e1" }}
                >
                  <p
                    className="font-semibold mb-1"
                    style={{ color: "#c0694e" }}
                  >
                    📍 Selected Location
                  </p>
                  <p className="mb-1">{selectedLocation.address}</p>
                  <p className="text-stone-400 text-xs">
                    {selectedLocation.lat.toFixed(5)},{" "}
                    {selectedLocation.lng.toFixed(5)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-stone-400 text-center">
                  Click anywhere on the map to select a pickup location
                </p>
              )}
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
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
              onClick={async () => {
                if (!selectedLocation)
                  return alert("Please select a pickup location");
                if (!phoneNumber)
                  return alert("Please enter your phone number");
                const currentTotal = await fetchCartTotal();
                const order_id = await handleOrder();
                handlePayment({
                  order_id: String(order_id),
                  amount: Number(currentTotal * 100),
                });
              }}
            >
              <ShoppingBag className="inline mr-2" size={18} />
              Pay Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
