import { useEffect, useState } from "react";
import { getTechnicians } from "../api";

export function useTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTechnicians()
      .then(setTechnicians)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { technicians, loading, error };
}
