// src/components/PrivateRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../api"; // axios instance dengan { withCredentials: true }

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.data && res.data.user) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // bisa diganti spinner
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
