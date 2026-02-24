import { assigmentApi } from "../../api/assigment";

export default function ManagerAssignmentPage() {
  const assignments = assigmentApi.getAssigments();
  return (
    <>
      <h1>Manage Assignments</h1>

      <div className="assignment-grid">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>task</th>
              <th>status</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>#{assignment.id}</td>
                <td>{assignment.task}</td>
                <td>
                  <span
                    className={`status-${assignment.status.replace(
                      " ",
                      "\\ ",
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </td>

                <td>
                  {assignment.groupid === null ? (
                    <a href={`/assign/${assignment.id}`}> assign </a>
                  ) : (
                    <a href={`/progress/${assignment.id}`}> watch progeress </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
