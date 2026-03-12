// src/hooks/useLogout.js

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function useLogout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);

      await axios.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      setLoading(false);

      navigate("/login");
    }
  };

  return { logout, loading };
}
