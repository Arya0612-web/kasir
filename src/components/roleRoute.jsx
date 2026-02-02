// src/components/RoleRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

export default function RoleRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Kalau belum login → ke login
  if (!user) return <Navigate to="/login" replace />;

  // Kalau login tapi role tidak sesuai → redirect ke dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.id_level)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Kalau sesuai → render children
  return children;
}
