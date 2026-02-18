import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faHouse,
  faUserGear,
  faClipboardList,
  faChartLine,
  faSearch,
  faBell,
  faEnvelope,
  faRightFromBracket,
  faGear,
  faRepeat,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const msgRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New assignment created", unread: true },
    { id: 2, text: "Technician updated status", unread: true },
    { id: 3, text: "Report generated", unread: false },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Manager sent you a message", unread: true },
    { id: 2, text: "Reminder about meeting", unread: false },
  ]);

  const unreadNotif = notifications.filter((n) => n.unread).length;
  const unreadMsg = messages.filter((m) => m.unread).length;

  /* ================= THEME INIT ================= */
  useEffect(() => {
    const html = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    html.classList.toggle("light");
    const newTheme = html.classList.contains("dark") ? "dark" : "light";
    setIsDark(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  /* ================= CLOSE OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(e.target)) {
        setMsgOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllNotifRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const markAllMsgRead = () => {
    setMessages(messages.map((m) => ({ ...m, unread: false })));
  };

  return (
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
        {/* MESSAGES */}
        <div className="dropdown-wrapper" ref={msgRef}>
          <div
            className="nav-icon badge-wrapper"
            onClick={() => setMsgOpen(!msgOpen)}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            {unreadMsg > 0 && <span className="badge">{unreadMsg}</span>}
          </div>

          {msgOpen && (
            <div className="dropdown-panel">
              <div className="panel-header">
                <span>Messages</span>
                <button onClick={markAllMsgRead}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
              <div className="panel-list">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`panel-item ${m.unread ? "unread" : ""}`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <div
            className="nav-icon badge-wrapper"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadNotif > 0 && <span className="badge">{unreadNotif}</span>}
          </div>

          {notifOpen && (
            <div className="dropdown-panel">
              <div className="panel-header">
                <span>Notifications</span>
                <button onClick={markAllNotifRead}>
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

        {/* PROFILE */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <div className="avatar" onClick={() => setProfileOpen(!profileOpen)}>
            A
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <Link to="/settings" className="dropdown-item">
                <FontAwesomeIcon icon={faGear} /> Settings
              </Link>

              <div className="dropdown-item">
                <FontAwesomeIcon icon={faRepeat} /> Switch Account
              </div>

              <div className="dropdown-item" onClick={toggleTheme}>
                <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
                {isDark ? " Dark Mode" : " Light Mode"}
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-item danger">
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
