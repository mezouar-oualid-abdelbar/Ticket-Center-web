import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

/**
 * @param {string[]} roles - array of allowed roles, e.g., ['admin', 'manager']
 */
export default function RoleProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>; // wait for auth context

  if (!user) {
    // user not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // user logged in but doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // user is logged in and has allowed role
  return <Outlet />;
}
