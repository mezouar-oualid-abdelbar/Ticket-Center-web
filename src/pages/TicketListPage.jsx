export default function TicketListPage() {
  return (
    <div>
      <h1>All Tickets</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department</th>
            <th>Status</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>{/* Map tickets from API or mock data */}</tbody>
      </table>
    </div>
  );
}
