import { useNavigate } from "react-router-dom";

export default function TicketTable({ tickets }) {
  const navigate = useNavigate();

  return (
    <div className="grid">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.description}</td>
                <td>
                  <span className={`status-${ticket.status}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  {ticket.status === "open" ? (
                    <button onClick={() => navigate(`/assign/${ticket.id}`)}>
                      Assign
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/progress/${ticket.id}`)}>
                      Watch Progress
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
