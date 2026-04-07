import { useEffect, useState } from "react";
import { getAssigments } from "../api";

export function useAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await getAssigments();
        setAssignments(data);
      } catch (err) {
        setError(err.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
  };
}
