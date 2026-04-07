// src/features/ticket/hooks/useCreateTicket.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api";
import { validateTicketForm } from "../validations/ticket";

const INITIAL_FORM = {
  description: "",
};

export function useCreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateTicketForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      await createTicket({ description: formData.description });
      setSuccess(true);
      setFormData(INITIAL_FORM);
      navigate("/"); // change to your tickets list route
    } catch (err) {
      setServerError(
        err.message || "Failed to create ticket. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formData,
    errors,
    serverError,
    isLoading,
    success,
    handleChange,
    handleSubmit,
  };
}
