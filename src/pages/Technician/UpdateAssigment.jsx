import { assigmentApi } from "../../api/assigment";
import Appointment from "../../components/forms/Appointment";
import Consltation from "../../components/forms/Consltation";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

export default function UpdateAssigment() {
  const { id } = useParams();
  const assignment = assigmentApi.getAssigment(Number(id));

  if (!assignment) {
    return <h2>Assignment not found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="route-container">
        <h1>{assignment.task}</h1>

        {assignment.status === "Pending" ? (
          <Appointment id={assignment.id} />
        ) : (
          <Consltation id={assignment.id} />
        )}
      </div>
    </>
  );
}
