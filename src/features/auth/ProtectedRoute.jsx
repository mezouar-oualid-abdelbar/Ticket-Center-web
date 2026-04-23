// src/features/auth/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  // Normalise: roles may be an array of strings or Role objects
  const userRoles = (Array.isArray(user.roles) ? user.roles : [])
    .map((r) => (typeof r === "string" ? r : (r?.name ?? "")))
    .filter(Boolean);

  // No role restriction on this route — allow any authenticated user
  if (roles.length === 0) return <Outlet />;

  if (!roles.some((r) => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
