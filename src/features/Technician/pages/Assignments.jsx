import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { useAssignments } from "../hooks/useAssignments";
import "../widget.css";

const priorityStyles = {
  low: { background: "#6c757d", color: "#fff", label: "Low" },
  normal: { background: "#0d6efd", color: "#fff", label: "Normal" },
  high: { background: "#fd7e14", color: "#fff", label: "High" },
  critical: { background: "#dc3545", color: "#fff", label: "Critical" },
};

const priorityOrder = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

function PriorityBadge({ priority }) {
  const style = priorityStyles[priority] || priorityStyles.normal;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 700,
        background: style.background,
        color: style.color,
        marginBottom: "8px",
        textTransform: "capitalize",
      }}
    >
      {style.label}
    </span>
  );
}

export default function Assignments() {
  const navigate = useNavigate();
  const { assignments, loading, error } = useAssignments();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const filteredAssignments = assignments
    .filter(
      (a) =>
        a.ticket?.status === "assigned" || a.ticket?.status === "in_progress",
    )
    .sort((a, b) => {
      const pa = priorityOrder[a.ticket?.priority] ?? 99;
      const pb = priorityOrder[b.ticket?.priority] ?? 99;
      return pa - pb;
    });

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
              const intervention = assignment.ticket?.interventions?.[0];
              const priority = assignment.ticket?.priority;

              return (
                <div
                  key={assignment.id}
                  className="widget"
                  style={{ cursor: "pointer", padding: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ margin: 0 }}>#{assignment.id}</h2>
                    <PriorityBadge priority={priority} />
                  </div>

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
                        cursor: "pointer",
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
