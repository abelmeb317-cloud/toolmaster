import { Navigate } from "react-router-dom";
import { authStore } from "../components/store/authStore";

export default function ProtectedRoute({ children }) {
  const auth = authStore.get();

  return auth?.token ? children : <Navigate to="/login" />;
}
