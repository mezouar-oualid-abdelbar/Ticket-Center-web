function HomePage() {
  return (
    <>
      <div>
        <h1>Welcome to the Ticket Management System</h1>
        <p>
          This system allows employees to report issues and managers to assign
          tickets to technicians for intervention.
        </p>
        <a href="/createAssigment">create ticket</a>
      </div>
      <div></div>
    </>
  );
}
export default HomePage;
