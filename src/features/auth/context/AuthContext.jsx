import { createContext, useContext, useEffect, useState } from "react";
import { http } from "../../../services/api/http";

export const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    http
      .get("me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        localStorage.removeItem("roles");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function login(userData) {
    setUser(userData);
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
