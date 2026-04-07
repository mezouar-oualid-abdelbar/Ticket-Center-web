import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import LeaderSelect from "../components/LeaderSelect";
import TechniciansSelect from "../components/TechniciansSelect";
import SelectedTechnicians from "../components/SelectedTechnicians";

import { useTicket } from "../hooks/useTicket";
import { useTechnicians } from "../hooks/useTechnicians";
import { useHandleSubmit } from "../hooks/useHandleSubmit";

import { inputStyle } from "../styles";

export default function CreateAssignment() {
  const { id } = useParams();

  // ✅ data hooks
  const { ticket, loading: ticketLoading } = useTicket(id);
  const { technicians, loading: techLoading } = useTechnicians();

  // ✅ submit hook (logic moved خارج)
  const { handleSubmit, loading, error } = useHandleSubmit(id);

  // ✅ local UI state only
  const [leader, setLeader] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  // ✅ fill form when ticket loads
  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || "");
      setPriority(ticket.priority || "");
    }
  }, [ticket]);

  // ✅ remove technician
  const removeTechnician = (id) => {
    setSelectedTechs((prev) => prev.filter((t) => t.id !== id));
  };

  // ⛔ loading state
  if (ticketLoading || techLoading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="route-container">
        <div style={{ maxWidth: 420 }}>
          {/* TITLE */}
          <h3>Title</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title..."
            style={inputStyle}
          />

          {/* PRIORITY */}
          <h3 style={{ marginTop: 20 }}>Priority</h3>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* DESCRIPTION (READ ONLY) */}
          <h3 style={{ marginTop: 20 }}>Description</h3>
          <div style={{ ...inputStyle, minHeight: 100 }}>
            {ticket?.description}
          </div>

          {/* LEADER */}
          <LeaderSelect
            technicians={technicians}
            leader={leader}
            setLeader={setLeader}
            removeTechnicianFromList={removeTechnician}
          />

          {/* TECHNICIANS */}
          <TechniciansSelect
            technicians={technicians}
            leader={leader}
            selectedTechs={selectedTechs}
            setSelectedTechs={setSelectedTechs}
          />

          {/* SELECTED TECHS */}
          <SelectedTechnicians
            technicians={selectedTechs}
            removeTechnician={removeTechnician}
          />

          {/* ERROR */}
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

          {/* SUBMIT */}
          <button
            onClick={() =>
              handleSubmit({
                title,
                priority,
                leader,
                selectedTechs,
              })
            }
            disabled={loading}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "#068FFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            {loading ? "Submitting..." : "Assign Ticket"}
          </button>
        </div>
      </div>
    </>
  );
}
