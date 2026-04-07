import { useEffect, useState, useMemo } from "react";
import { getTickets } from "../api";

const PAGE_SIZE = 10;

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTickets()
      .then((data) => setTickets(data))
      .catch((err) => setError(err.message || "Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [status]);

  const filtered = useMemo(() => {
    if (status === "all") return tickets;
    return tickets.filter((t) => t.status === status);
  }, [tickets, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    loading,
    error,
    status,
    setStatus,
    page,
    setPage,
    paginated,
    totalPages,
    total: filtered.length,
  };
}
