// src/pages/Signup.jsx
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to register. Ensure server is running on port 5000.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 border-t-4 border-orange-500"
      >
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Create Account
        </h1>

        <input
          className="w-full p-3 mb-3 border rounded-lg"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-3 border rounded-lg"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold">
          Create Account
        </button>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <a href="/login" className="text-orange-600 font-semibold">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
