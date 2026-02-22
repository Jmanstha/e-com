import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

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
      // Later we will navigate to the Dashboard here
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    /* Tailwind classes are used in 'className' */
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={formData.user_name}
          onChange={(e) =>
            setFormData({ ...formData, user_name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={formData.user_email}
          onChange={(e) =>
            setFormData({ ...formData, user_email: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Already have an account?
        <Link to="/" className="text-blue-500 ml-1">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
