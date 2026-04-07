import { useEffect, useState } from "react";
import { getTicket } from "../api";

export function useTicket(id) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    getTicket(id)
      .then(setTicket)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { ticket, loading, error };
}
