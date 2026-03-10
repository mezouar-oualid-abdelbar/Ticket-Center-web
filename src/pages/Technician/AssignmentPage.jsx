import { assigmentApi } from "../../api/assigment";
import Navbar from "../../components/navbar/Navbar";

export default function AssignmentPage() {
  const assignments = assigmentApi.getAssigments();

  // Filter only Pending and In Progress
  const filteredAssignments = assignments.filter(
    (a) => a.status === "Pending" || a.status === "In Progress",
  );
  function handleAssignmentClick(assignment) {
    window.location.assign("/UpdateAssigment/" + assignment.id);
  }
  return (
    <>
      <Navbar />

      <div className="route-container">
        <h1>Your Assignments</h1>
        <div className="assignment-grid">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="assignment-widget"
              onClick={() => handleAssignmentClick(assignment)}
              style={{ cursor: "pointer" }} // makes it visually clickable
            >
              <h2>#{assignment.id}</h2>
              <p>{assignment.task}</p>
              <span
                className={`status-${assignment.status.replace(" ", "\\ ")}`}
              >
                {assignment.status === "Pending"
                  ? "make appointment"
                  : "consltation"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
