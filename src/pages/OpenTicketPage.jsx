export default function OpenTicketPage() {
  return (
    <div>
      <h1>Open a New Ticket</h1>
      <form>
        <label>
          Department:
          <input type="text" placeholder="Your department" />
        </label>
        <label>
          Issue Description:
          <textarea placeholder="Describe the issue..." />
        </label>
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}
