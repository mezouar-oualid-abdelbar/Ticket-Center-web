import { useAuthContext } from "../features/auth/context/AuthContext";

/**
 * Hook to check if current user has one of the allowed roles
 * @param {string[]} allowedRoles - e.g., ["admin", "manager"]
 * @returns {boolean}
 */
export function useHasRole(allowedRoles = []) {
  const { user } = useAuthContext();

  if (!user) return false;

  // if user.role is a string
  if (typeof user.role === "string") {
    return allowedRoles.includes(user.role);
  }

  // if user.roles is an array
  if (Array.isArray(user.roles)) {
    return user.roles.some((role) => allowedRoles.includes(role));
  }

  return false;
}
