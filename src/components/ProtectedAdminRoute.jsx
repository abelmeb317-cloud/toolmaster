import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { authStore } from "./store/authStore";

export default function ProtectedAdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null); // null=loading, false=deny, true=allow

  useEffect(() => {
    const auth = authStore.get();
    if (!auth?.token) {
      setAllowed(false);
      return;
    }

    // Validate token with server (/profile returns decoded token payload)
    let mounted = true;
    api
      .get("/profile")
      .then((res) => {
        if (!mounted) return;
        const role = res.data?.user?.role || res.data?.user?.role;
        if (role === "ADMIN") setAllowed(true);
        else setAllowed(false);
      })
      .catch(() => {
        if (!mounted) return;
        setAllowed(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (allowed === null) return null; // or a spinner
  return allowed ? children : <Navigate to="/login" />;
}
