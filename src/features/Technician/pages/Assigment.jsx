// Assignment.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Appointment from "../components/Appointment";
import Consultation from "../components/Consultation"; // fix typo
import { useAssignment } from "../hooks/useAssignment"; // fix typo

export default function Assignment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assignment, loading, error } = useAssignment(id);
  const [showAppointment, setShowAppointment] = useState(false);
  const [currentInterventionId, setCurrentInterventionId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!assignment) return <h2>Assignment not found</h2>;

  const ticket = assignment.ticket;
  const interventions = ticket?.interventions || [];
  const ticketId = ticket?.id;

  const interventionWithEmptyNote = interventions.find((i) => !i.note);

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1>{ticket?.title || "No Title"}</h1>
        <p>{ticket?.description || "No Description"}</p>

        {/* Consultation Form — shown when there's an incomplete intervention */}
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
            interventionId={currentInterventionId} // ← pass it down
            onSuccess={() => navigate("/technician/assignments")}
          />
        )}

        {/* Fallback: no pending consultation, no appointment shown yet */}
        {!showAppointment && !interventionWithEmptyNote && (
          <button onClick={() => setShowAppointment(true)}>
            Make Appointment
          </button>
        )}

        {/* Interventions List */}
        <div style={{ marginTop: 20 }}>
          <h3>Interventions</h3>
          {interventions.map((intervention) => (
            <div key={intervention.id} style={{ marginBottom: 10 }}>
              {" "}
              {/* use .id */}
              <strong>
                {intervention.appointment || "No appointment yet"}
              </strong>
              <p>{intervention.note || "No note yet"}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
