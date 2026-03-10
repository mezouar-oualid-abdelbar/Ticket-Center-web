import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUser, faPencil } from "@fortawesome/free-solid-svg-icons";

export default function Facelities() {
  return (
    <div className="route-container">
      <h1>Manage facilities</h1>
      <a href="">create facilities</a>
      <div className="assignment-grid">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#</td>
              <td>name</td>
              <td>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href="/dashboard/facelityManagement">
                    <FontAwesomeIcon icon={faUserTie} />
                    <span>Managers</span>
                  </a>

                  <a href="/dashboard/facelityWorker">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Workers</span>
                  </a>

                  <a href="/dashboard/facelityManage">
                    <FontAwesomeIcon icon={faPencil} />
                    <span>Edit</span>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
