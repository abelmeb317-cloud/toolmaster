import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { authStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        navigate("/admin");
      } else {
        toast.success("Welcome User 👤");
        navigate("/");
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-gradient-to-br from-orange-500 via-orange-100 to-orange-200">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-orange-100/50"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Log in to access your ToolMaster account
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaUser className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white outline-none transition"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaLock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white outline-none transition"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-orange-400"
          >
            Log In
          </button>

          <p className="text-center mt-6 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-600 hover:text-orange-700 font-bold transition"
            >
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
