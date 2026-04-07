import { useEffect, useState } from "react";
import { getAssigment } from "../api";

export function useAssignment(id) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchAssignment() {
      try {
        const data = await getAssigment(id);
        setAssignment(data);
      } catch (err) {
        setError(err.message || "Failed to load assignment");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [id]);

  return {
    assignment,
    loading,
    error,
  };
}
