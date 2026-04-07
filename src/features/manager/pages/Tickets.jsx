// src/features/manager/pages/Tickets.jsx

import Navbar from "../../../components/layout/Navbar";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import TicketPagination from "../components/TicketPagination";
import { useTickets } from "../hooks/useTickets";
import "../../../assets/styles/table.css";

export default function Tickets() {
  const {
    loading,
    error,
    status,
    setStatus,
    page,
    setPage,
    paginated,
    totalPages,
    total,
  } = useTickets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "#e02424" }}>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1>Manage Tickets</h1>
        <TicketFilters status={status} onChange={setStatus} />
        <TicketTable tickets={paginated} />
        <TicketPagination
          page={page}
          totalPages={totalPages}
          total={total}
          onChange={setPage}
        />
      </div>
    </>
  );
}
