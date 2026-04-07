import Navbar from "../../../components/layout/Navbar";

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="route-container">
        <div>
          <h1>404</h1>
          <p>page not found .</p>
          <a href="/">return home page</a>
        </div>
        <div></div>
      </div>
    </>
  );
}
export default NotFound;
