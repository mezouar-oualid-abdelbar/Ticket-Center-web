import Navbar from "../../../components/layout/Navbar";

function Unauthorized() {
  return (
    <>
      <Navbar />
      <div className="route-container">
        <div>
          <h1>Unauthorized</h1>
          <p> your are not authorized to access this link.</p>
          <a href="/">return home page</a>
        </div>
        <div></div>
      </div>
    </>
  );
}
export default Unauthorized;
