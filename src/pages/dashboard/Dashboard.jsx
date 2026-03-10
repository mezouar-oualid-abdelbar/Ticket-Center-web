import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserTie,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <div className="route-container">
      {/* users widget */}
      <h1>Dashboard</h1>
      <div className="assignment-grid">
        <div className="assignment-widget">
          <h2>
            <FontAwesomeIcon icon={faUsers} />
          </h2>
          <p>Workers</p>
          <span>
            {" "}
            <a href="/dashboard/users">manage </a>
          </span>
        </div>
        <div className="assignment-widget">
          <h2>
            <FontAwesomeIcon icon={faUserTie} />
          </h2>
          <p>managers</p>
          <span>
            {" "}
            <a href="/dashboard/users">manage </a>
          </span>
        </div>
        {/* facelityes widget */}
        <div className="assignment-widget">
          <h2>
            <FontAwesomeIcon icon={faBuildingColumns} />
          </h2>
          <p>facelityes</p>
          <span>
            {" "}
            <a href="/dashboard/facelities">manage </a>
          </span>
        </div>
      </div>
    </div>
  );
}
