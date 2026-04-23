// src/features/auth/context/AuthContext.jsx
//
// FIX 1: After login, merge roles/permissions INTO the user object so
//         useHasRole() and ProtectedRoute work immediately without a reload.
//
// FIX 2: /me response also has { user, roles, permissions } — merge them too.

import { createContext, useContext, useEffect, useState } from "react";
import { http } from "../../../services/api/http";

export const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

// Merge { user: {id,name,email}, roles: [...], permissions: [...] }
// into a single flat object: { id, name, email, roles: [...], permissions: [...] }
function mergeUserData(data) {
  if (!data) return null;
  const base = data.user ?? data;
  return {
    ...base,
    roles: data.roles ?? base.roles ?? [],
    permissions: data.permissions ?? base.permissions ?? [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    http
      .get("me")
      .then((res) => setUser(mergeUserData(res.data)))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        localStorage.removeItem("roles");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Called right after a successful login API response
  function login(userData) {
    setUser(mergeUserData(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("roles");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
