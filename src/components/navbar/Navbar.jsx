import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faHouse,
  faUserGear,
  faClipboardList,
  faChartLine,
  faBell,
  faEnvelope,
  faRightFromBracket,
  faGear,
  faRepeat,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/navbar.css";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useTheme } from "../../hooks/useTheme";
import { useDropdown } from "../../hooks/useDropdown";
import { useNotifications } from "../../hooks/useNotifications";
import useLogout from "../../hooks/useLogout";

import ChatBox from "../ChatBox";

function Navbar() {
  /* ================= HOOKS ================= */

  const { isDark, toggleTheme } = useTheme();
  const { logout, loading } = useLogout();
  const profile = useDropdown();
  const notif = useDropdown();
  const msg = useDropdown();

  const { notifications, unreadCount, markAllRead } = useNotifications();

  const [messages] = useState([
    { id: 1, text: "Manager sent you a message", unread: true },
    { id: 2, text: "Reminder about meeting", unread: false },
  ]);

  const [activeChat, setActiveChat] = useState(null);

  const unreadMsg = messages.filter((m) => m.unread).length;

  /* ================= UI ================= */

  return (
    <>
      <nav className="fb-navbar">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo">TC</div>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <Link to="/" className="nav-icon">
            <FontAwesomeIcon icon={faHouse} />
          </Link>

          <Link to="/technician/assignments" className="nav-icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </Link>

          <Link to="/manage/assignments" className="nav-icon">
            <FontAwesomeIcon icon={faUserGear} />
          </Link>

          <Link to="/dashboard" className="nav-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {/* ================= MESSAGES ================= */}
          <div className="dropdown-wrapper" ref={msg.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => msg.setOpen(!msg.open)}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              {unreadMsg > 0 && <span className="badge">{unreadMsg}</span>}
            </div>

            {msg.open && (
              <div className="dropdown-panel">
                <div className="panel-header">
                  <span>Messages</span>
                </div>

                <div className="panel-list">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`panel-item ${m.unread ? "unread" : ""}`}
                      onClick={() => {
                        setActiveChat(m);
                        msg.setOpen(false);
                      }}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= NOTIFICATIONS ================= */}
          <div className="dropdown-wrapper" ref={notif.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => notif.setOpen(!notif.open)}
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            {notif.open && (
              <div className="dropdown-panel">
                <div className="panel-header">
                  <span>Notifications</span>

                  <button onClick={markAllRead}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>

                <div className="panel-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`panel-item ${n.unread ? "unread" : ""}`}
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= PROFILE ================= */}
          <div className="dropdown-wrapper" ref={profile.ref}>
            <div
              className="avatar"
              onClick={() => profile.setOpen(!profile.open)}
            >
              A
            </div>

            {profile.open && (
              <div className="profile-dropdown">
                <Link to="/settings" className="dropdown-item">
                  <FontAwesomeIcon icon={faGear} />
                  Settings
                </Link>

                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faRepeat} />
                  Switch Account
                </div>

                <div className="dropdown-item" onClick={toggleTheme}>
                  <FontAwesomeIcon icon={isDark ? faMoon : faSun} />

                  {isDark ? " Dark Mode" : " Light Mode"}
                </div>

                <div className="dropdown-divider"></div>

                <button
                  onClick={logout}
                  disabled={loading}
                  className="dropdown-item danger"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= CHAT ================= */}

      {activeChat && (
        <ChatBox message={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </>
  );
}

export default Navbar;
