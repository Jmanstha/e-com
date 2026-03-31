import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useStore } from "@/store/useStore";
import {
  CheckCircle,
  XCircle,
  Loader,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

const params = new URLSearchParams(window.location.search);
const pidx = params.get("pidx");

// Store pidx in sessionStorage immediately in case of HMR reload
if (pidx) {
  sessionStorage.setItem("khalti_pidx", pidx);
}

// Fall back to sessionStorage if pidx disappeared from URL
const resolvedPidx = pidx || sessionStorage.getItem("khalti_pidx");

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState(pidx ? "verifying" : "failed");
  const orderId = localStorage.getItem("pending_order_id");
  const handleUpdateOrderStatus = useStore(
    (state) => state.handleUpdateOrderStatus,
  );

  useEffect(() => {
    if (!resolvedPidx) return;

    api
      .get(`/payment/verify?pidx=${pidx}`)
      .then((res) => {
        if (res.data.status === "Completed") {
          sessionStorage.removeItem("khalti_pidx");
          setStatus("success");
          handleUpdateOrderStatus(2, orderId);
          localStorage.removeItem("pending_order_id");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [handleUpdateOrderStatus, orderId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#faf6f1", fontFamily: "Georgia, serif" }}
    >
      <div className="w-full max-w-xl text-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-6">
            <Loader
              size={64}
              className="animate-spin"
              style={{ color: "#c0694e" }}
            />
            <p className="text-2xl" style={{ color: "#3d2b1f" }}>
              Verifying your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-2xl shadow-lg px-12 py-16 flex flex-col items-center gap-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#ede5dc" }}
            >
              <CheckCircle size={64} style={{ color: "#c0694e" }} />
            </div>
            <div>
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: "#3d2b1f" }}
              >
                Order Placed!
              </h1>
              <p className="text-stone-500 text-base">
                Your payment was successful. We'll get your order ready soon.
              </p>
            </div>
            <div className="flex gap-4 w-full pt-2">
              <Link to="/" className="flex-1">
                <button
                  className="w-full py-4 rounded-xl font-medium transition-all hover:bg-stone-100"
                  style={{
                    border: "2px solid #d6c9bc",
                    color: "#7a5c4a",
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                  }}
                >
                  <ShoppingBag className="inline mr-2" size={18} />
                  Browse More Products
                </button>
              </Link>
              <Link to="/orders" className="flex-1">
                <button
                  className="w-full py-4 rounded-xl font-medium text-white transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#c0694e",
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                  }}
                >
                  <ClipboardList className="inline mr-2" size={18} />
                  My Orders
                </button>
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-white rounded-2xl shadow-lg px-12 py-16 flex flex-col items-center gap-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#ede5dc" }}
            >
              <XCircle size={64} style={{ color: "#c0694e" }} />
            </div>
            <div>
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: "#3d2b1f" }}
              >
                Payment Failed
              </h1>
              <p className="text-stone-500 text-base">
                Something went wrong or the payment was cancelled. Please try
                again.
              </p>
            </div>
            <Link to="/checkout" className="w-full">
              <button
                className="w-full py-4 rounded-xl font-medium text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#c0694e",
                  fontFamily: "Georgia, serif",
                  fontSize: "1rem",
                }}
              >
                Try Again
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
