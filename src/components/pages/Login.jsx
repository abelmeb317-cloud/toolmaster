// src/pages/Login.jsx
import { useState } from "react";
import api from "../../api/axios";
import { authStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      // Store token, role and username in authStore
      authStore.set({
        token: res.data.token,
        role: res.data.role,
        username: res.data.username,
      });

      // Clear cart after successful login
      const clearCart = useCartStore.getState().clearCart;
      if (typeof clearCart === "function") clearCart();

      // ROLE CHECK
      if (res.data.role === "ADMIN") {
        toast.success("Welcome Admin 🔥");
        window.location.href = "/admin";
      } else {
        toast.success("Welcome User 👤");
        window.location.href = "/";
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to login. Ensure server is running on port 5000.";
      console.error("Login error:", err);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 border-t-4 border-orange-500"
      >
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login
        </h1>

        <input
          className="w-full p-3 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold">
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          No account?{" "}
          <a href="/signup" className="text-orange-600 font-semibold">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
