import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Always register normal users from the client
      await api.post("/register", {
        username,
        password,
        role: "USER",
      });

      toast.success("Account created 🎉");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to register. Ensure server is running on port 5000.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-orange-100/50"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Sign up to start shopping with ToolMaster
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
                  placeholder="Choose a username"
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
                  placeholder="Create a strong password"
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
            Create Account
          </button>

          <p className="text-center mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-bold transition"
            >
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
