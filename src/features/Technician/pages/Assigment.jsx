import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";

import Appointment from "../components/Appointment";
import Consultation from "../components/Consltation";

import { useAssignment } from "../hooks/useAssigment";

export default function Assignment() {
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

  // Find first intervention without a note
  const interventionWithEmptyNote = interventions.find((i) => !i.note);

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1>{ticket?.title || "No Title"}</h1>
        <p>{ticket?.description || "No Description"}</p>

        {/* Consultation Form */}
        {interventionWithEmptyNote && !showAppointment ? (
          <Consultation
            interventionid={interventionWithEmptyNote.id}
            onComplete={(interventionId) => {
              setCurrentInterventionId(interventionId);
              setShowAppointment(true); // show appointment after consultation
            }}
          />
        ) : null}

        {/* Appointment Form */}
        {ticketId && showAppointment && (
          <Appointment
            ticketId={ticketId}
            onSuccess={() => {
              setShowAppointment(false);
              setCurrentInterventionId(null);
            }}
          />
        )}

        {/* Fallback button */}
        {!showAppointment && !interventionWithEmptyNote && (
          <button onClick={() => setShowAppointment(true)}>
            Make Appointment
          </button>
        )}

        {/* Interventions List */}
        <div style={{ marginTop: 20 }}>
          <h3>Interventions</h3>
          {interventions.map((i, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <strong>{i.appointment || "No appointment yet"}</strong>
              <p>{i.note || "No note yet"}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
