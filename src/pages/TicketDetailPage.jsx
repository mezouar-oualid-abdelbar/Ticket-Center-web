// pages/TicketDetailPage.jsx
import { useParams } from "react-router-dom";

export default function TicketDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Ticket Detail: #{id}</h1>
      <p>Department: IT</p>
      <p>Status: In Progress</p>
      <p>Description: The server is not responding...</p>
      <p>Assigned to: Technician Name</p>
      <form>
        <label>
          Update Status:
          <select>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="reassign">Reassign</option>
          </select>
        </label>
        <label>
          Notes:
          <textarea placeholder="Add notes or reasons for reassignment..." />
        </label>
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
}
