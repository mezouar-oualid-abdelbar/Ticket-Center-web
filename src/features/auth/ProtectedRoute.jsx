import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext"; // fix import path

export default function RoleProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // handle both user.role (string) and user.roles (array)
  const userRoles = Array.isArray(user.roles)
    ? user.roles
    : user.role
      ? [user.role]
      : [];

  if (roles.length && !roles.some((r) => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
