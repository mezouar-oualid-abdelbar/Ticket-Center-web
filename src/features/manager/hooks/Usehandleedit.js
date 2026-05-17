import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAssignment } from "../api";
import { assignment as validate } from "../validations/assigment";

export function useHandleEdit(ticketId) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = async ({ title, priority, leader, selectedTechs }) => {
    setError("");

    const validationError = validate({
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
      // Exclude leader from technician_ids — backend merges them
      technician_ids: selectedTechs
        .filter((t) => t.id !== leader.id)
        .map((t) => t.id),
    };

    try {
      setLoading(true);
      await updateAssignment(ticketId, data);
      navigate("/manager/tickets");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { handleEdit, loading, error };
}
