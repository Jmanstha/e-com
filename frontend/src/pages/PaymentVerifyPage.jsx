import { useState, useEffect } from "react";
import api from "@/api/axios";

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pidx = params.get("pidx");

    if (pidx) {
      api
        .post(`/payment/verify?pidx=${pidx}`)
        .then((res) => {
          if (res.data.status === "Completed") {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        })
        .catch(() => setStatus("failed"));
    }
  }, []);

  return (
    <div>
      {status === "verifying" && <p>Verifying your payment...</p>}
      {status === "success" && <p>Payment successful!</p>}
      {status === "failed" && <p>Payment failed or cancelled.</p>}
    </div>
  );
}
