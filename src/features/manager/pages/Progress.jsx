import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { getTiketProgress } from "../api"; // your API function

export default function Progress() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const data = await getTiketProgress(id);
        setTicket(data);
      } catch (err) {
        setError(err.message || "Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  if (loading) return <p>Loading ticket data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div>
      <Navbar />

      <div className="route-container">
        <h1>{ticket.title}</h1>
        <p>
          <strong>Description:</strong> {ticket.description}
        </p>
        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Completed At:</strong>{" "}
          {ticket.completed_at || "Not completed yet"}
        </p>

        {/* =================== ASSIGNMENTS =================== */}
        <h2>Assignments</h2>
        {ticket.assigments && ticket.assigments.length > 0 ? (
          ticket.assigments.map((assignment) => (
            <div
              key={assignment.id}
              style={{
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                border: "1px solid #ccc",
              }}
            >
              <p>
                <strong>Created At:</strong> {assignment.created_at}
              </p>
              <p>
                <strong>Leader:</strong> {assignment.leader?.name} (
                {assignment.leader?.email})
              </p>
              <p>
                <strong>Dispatcher:</strong> {assignment.dispatcher?.name} (
                {assignment.dispatcher?.email})
              </p>

              <h3>Technicians</h3>
              {assignment.technicians && assignment.technicians.length > 0 ? (
                <ul>
                  {assignment.technicians.map((tech) => (
                    <li key={tech.id}>
                      {tech.name} - {tech.email} (ID: {tech.id})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No technicians assigned</p>
              )}
            </div>
          ))
        ) : (
          <p>No assignments found</p>
        )}

        {/* =================== INTERVENTIONS =================== */}
        <h2>Interventions</h2>
        {ticket.interventions && ticket.interventions.length > 0 ? (
          ticket.interventions.map((intervention, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                border: "1px solid #ccc",
              }}
            >
              <p>
                <strong>Appointment:</strong> {intervention.appointment}
              </p>
              <p>
                <strong>Note:</strong> {intervention.note}
              </p>
            </div>
          ))
        ) : (
          <p>No interventions recorded</p>
        )}
      </div>
    </div>
  );
}
