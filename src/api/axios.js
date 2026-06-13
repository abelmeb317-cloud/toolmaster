import axios from "axios";
import { authStore } from "../components/store/authStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = authStore.get();

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ❌ Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out...");
      authStore.logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
