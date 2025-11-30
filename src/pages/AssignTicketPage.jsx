export default function AssignTicketPage() {
  return (
    <div>
      <h1>Assign Tickets to Technicians</h1>
      <form>
        <label>
          Select Ticket:
          <select>{/* Map ticket options */}</select>
        </label>
        <label>
          Assign To Technician:
          <select>{/* Map technician options */}</select>
        </label>
        <button type="submit">Assign Ticket</button>
      </form>
    </div>
  );
}
