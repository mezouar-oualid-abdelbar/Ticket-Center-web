import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { useAssignments } from "../hooks/useAssignments";

import "../widget.css";

export default function Assignments() {
  const navigate = useNavigate();

  const { assignments, loading, error } = useAssignments();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Only assignments that are active for technician
  const filteredAssignments = assignments.filter(
    (a) =>
      a.ticket?.status === "assigned" || a.ticket?.status === "in_progress",
  );

  const handleAssignmentClick = (assignment) => {
    navigate("/technician/assignment/" + assignment.id);
  };

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1>Your Assignments</h1>

        <div className="grid">
          {filteredAssignments.length === 0 ? (
            <p>No active assignments</p>
          ) : (
            filteredAssignments.map((assignment) => {
              const intervention = assignment.ticket?.interventions?.[0]; // assuming first intervention
              const canComplete = !intervention || !intervention.note; // if no note yet, can complete

              return (
                <div
                  key={assignment.id}
                  className="widget"
                  style={{ cursor: "pointer", padding: "15px" }}
                >
                  <h2>#{assignment.id}</h2>
                  <p>{assignment.ticket?.title || "No title"}</p>

                  {intervention ? (
                    <div>
                      <p>
                        Appointment:{" "}
                        {intervention.appointment
                          ? new Date(intervention.appointment).toLocaleString()
                          : "Not set"}
                      </p>
                      <p>Note: {intervention.note || "No note yet"}</p>
                    </div>
                  ) : (
                    <p>No intervention yet</p>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => handleAssignmentClick(assignment)}
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        backgroundColor: "#068FFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      {intervention ? "Add Note" : "Set Appointment / Note"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
