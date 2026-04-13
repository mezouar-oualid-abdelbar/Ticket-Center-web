import { useAuthContext } from "../features/auth/context/AuthContext";

export function useHasRole(allowedRoles = []) {
  const { user } = useAuthContext();

  if (!user) return false;

  // handle both user.role (string) and user.roles (array)
  const userRoles = Array.isArray(user.roles)
    ? user.roles
    : user.role
      ? [user.role]
      : [];

  return allowedRoles.some((role) => userRoles.includes(role));
}
