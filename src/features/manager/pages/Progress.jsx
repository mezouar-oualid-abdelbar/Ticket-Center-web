// src/features/manager/pages/Progress.jsx  (UPDATED — with Chat button)

import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import ChatBox from "../../../components/ChatBox";
import { http } from "../../../services/api/http";
import { useEffect } from "react";

const statusColors = {
  open: "#6c757d",
  assigned: "#0d6efd",
  in_progress: "#fd7e14",
  resolved: "#198754",
  closed: "#343a40",
};

export default function Progress() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    http
      .get(`manager/ticket/${id}/progress`)
      .then((res) => setTicket(res.data))
      .catch(() => setError("Failed to load ticket progress."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="route-container">
          <p>Loading…</p>
        </div>
      </>
    );
  if (error)
    return (
      <>
        <Navbar />
        <div className="route-container">
          <p style={{ color: "var(--danger)" }}>{error}</p>
        </div>
      </>
    );
  if (!ticket)
    return (
      <>
        <Navbar />
        <div className="route-container">
          <p>Ticket not found.</p>
        </div>
      </>
    );

  const color = statusColors[ticket.status] || "#6c757d";

  return (
    <>
      <Navbar />
      <div className="route-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem" }}>
              {ticket.title || `Ticket #${ticket.id}`}
            </h1>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 20,
                background: color,
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {ticket.status?.replace("_", " ")}
            </span>
          </div>
          <button
            onClick={() => setChatOpen((o) => !o)}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            {chatOpen ? "✕ Close Chat" : "💬 Open Chat"}
          </button>
        </div>

        {/* Description */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
          }}
        >
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "0.9rem",
              color: "var(--muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Description
          </h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{ticket.description}</p>
        </div>

        {/* Assignments */}
        {ticket.assigments?.map((assignment) => (
          <div
            key={assignment.id}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: "1rem" }}>
              Assignment #{assignment.id}
            </h3>

            {assignment.leader && (
              <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                  Leader:{" "}
                </span>
                {assignment.leader.name}
              </p>
            )}

            {assignment.technicians?.length > 0 && (
              <div>
                <span
                  style={{
                    color: "var(--muted)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Technicians:{" "}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  {assignment.technicians.map((tech) => (
                    <span
                      key={tech.id}
                      style={{
                        background: "var(--glass)",
                        border: "1px solid var(--card-border)",
                        borderRadius: 20,
                        padding: "3px 12px",
                        fontSize: "0.82rem",
                      }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Interventions */}
        {ticket.interventions?.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 12px" }}>Interventions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ticket.interventions.map((iv) => (
                <div
                  key={iv.id}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "var(--radius)",
                    padding: "14px 18px",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    📅{" "}
                    {iv.appointment
                      ? new Date(iv.appointment).toLocaleString()
                      : "No appointment set"}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    {iv.note || "No note yet."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ticket.completed_at && (
          <p style={{ color: "var(--success)", fontWeight: 600 }}>
            ✓ Completed at: {new Date(ticket.completed_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Chat */}
      {chatOpen && (
        <ChatBox
          ticketId={ticket.id}
          ticketTitle={ticket.title || `Ticket #${ticket.id}`}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
