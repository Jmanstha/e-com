import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    setError("");

    try {
      await authService.signup(formData);
      navigate("/Login");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#faf6f1", fontFamily: "Georgia, serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#c0694e" }}
        >
          <ShoppingBag size={16} className="text-white" />
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: "#3d2b1f" }}
        >
          Yarnly
        </span>
      </div>

      {/* Card */}
      <div
        className="p-8 rounded-2xl w-96 border"
        style={{ backgroundColor: "#fff", borderColor: "#e8ddd4" }}
      >
        <h2
          className="text-2xl font-bold mb-1 text-center"
          style={{ color: "#3d2b1f" }}
        >
          Create an account
        </h2>
        <p className="text-center text-sm text-stone-400 mb-6">
          Join the Yarnly collection
        </p>

        {error && (
          <p
            className="text-sm mb-4 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "#fdecea", color: "#c0694e" }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "#e8ddd4",
              fontFamily: "Georgia, serif",
              color: "#3d2b1f",
            }}
            value={formData.user_name}
            onChange={(e) =>
              setFormData({ ...formData, user_name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "#e8ddd4",
              fontFamily: "Georgia, serif",
              color: "#3d2b1f",
            }}
            value={formData.user_email}
            onChange={(e) =>
              setFormData({ ...formData, user_email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "#e8ddd4",
              fontFamily: "Georgia, serif",
              color: "#3d2b1f",
            }}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "#e8ddd4",
              fontFamily: "Georgia, serif",
              color: "#3d2b1f",
            }}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#c0694e" }}
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Login link */}
      <p className="mt-5 text-sm text-stone-500">
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#c0694e" }}
          className="font-medium hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
