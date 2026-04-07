import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../api";
import { assignment } from "../validations/assigment";

export function useHandleSubmit(ticketId) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async ({ title, priority, leader, selectedTechs }) => {
    setError("");

    // ✅ validation first
    const validationError = assignment({
      title,
      priority,
      leader,
      selectedTechs,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const data = {
      title,
      priority,
      leader_id: leader.id,
      technician_ids: selectedTechs.map((t) => t.id),
    };

    try {
      setLoading(true);
      await createAssignment(ticketId, data);
      navigate("/manager/tickets");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
  };
}
