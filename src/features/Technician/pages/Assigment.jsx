// src/features/Technician/pages/Assigment.jsx  (UPDATED — with Chat button)

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Appointment from "../components/Appointment";
import Consultation from "../components/Consultation";
import ChatBox from "../../../components/ChatBox";
import { useAssignment } from "../hooks/useAssignment";

export default function Assignment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assignment, loading, error } = useAssignment(id);
  const [showAppointment, setShowAppointment] = useState(false);
  const [currentInterventionId, setCurrentInterventionId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

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
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </>
    );
  if (!assignment)
    return (
      <>
        <Navbar />
        <div className="route-container">
          <h2>Assignment not found</h2>
        </div>
      </>
    );

  const ticket = assignment.ticket;
  const interventions = ticket?.interventions || [];
  const ticketId = ticket?.id;
  const interventionWithEmptyNote = interventions.find((i) => !i.note);

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
            <h1 style={{ margin: "0 0 4px" }}>{ticket?.title || "No Title"}</h1>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Assignment #{assignment.id}
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
            }}
          >
            {chatOpen ? "✕ Close Chat" : "💬 Chat"}
          </button>
        </div>

        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          {ticket?.description || "No Description"}
        </p>

        {/* Consultation Form */}
        {interventionWithEmptyNote && !showAppointment && (
          <Consultation
            interventionid={interventionWithEmptyNote.id}
            onComplete={(interventionId) => {
              setCurrentInterventionId(interventionId);
              setShowAppointment(true);
            }}
          />
        )}

        {/* Appointment Form */}
        {ticketId && showAppointment && (
          <Appointment
            ticketId={ticketId}
            interventionId={currentInterventionId}
            onSuccess={() => navigate("/technician/assignments")}
          />
        )}

        {/* Fallback button */}
        {!showAppointment && !interventionWithEmptyNote && (
          <button
            onClick={() => setShowAppointment(true)}
            style={{
              padding: "10px 20px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Make Appointment
          </button>
        )}

        {/* Interventions list */}
        {interventions.length > 0 && (
          <div>
            <h3>Interventions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {interventions.map((iv) => (
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
      </div>

      {/* Chat */}
      {chatOpen && ticketId && (
        <ChatBox
          ticketId={ticketId}
          ticketTitle={ticket?.title || `Ticket #${ticketId}`}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
