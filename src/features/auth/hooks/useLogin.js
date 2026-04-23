// src/features/auth/hooks/useLogin.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api";
import { validateLoginForm } from "../validation";
import { useAuthContext } from "./useAuthContext";

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const data = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      // Pass the FULL response (which includes roles + permissions at top level)
      // AuthContext.login() will merge them into the user object
      login(data);

      navigate("/");
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
