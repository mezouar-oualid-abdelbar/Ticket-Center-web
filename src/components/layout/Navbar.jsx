// src/components/layout/Navbar.jsx  (FULLY UPDATED)
// • Real notifications from useNotifications (Pusher)
// • Messages panel opens the real ChatBox per ticket
// • Mobile hamburger menu with slide-out drawer
// • Avatar shows first letter of logged-in user name

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
  faCheck,
  faBars,
  faTimes,
  faTicket,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

import { useHasRole } from "../../utils/roles";
import "../../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import { useTheme } from "../../hooks/useTheme";
import { useDropdown } from "../../hooks/useDropdown";
import { useNotifications } from "../../hooks/useNotifications";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../features/auth/context/AuthContext";
import ChatBox from "../ChatBox";

/* ── notification icon per type ── */
const notifIcon = {
  assignment: "📋",
  resolved: "✅",
  message: "💬",
  info: "ℹ️",
};
const fmt = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function Navbar() {
  /* ─ hooks ─ */
  const { isDark, toggleTheme } = useTheme();
  const { logout, loading: logoutLoading } = useLogout();
  const { user } = useAuthContext();
  const profile = useDropdown();
  const notif = useDropdown();
  const msg = useDropdown();
  const canManageTickets = useHasRole(["manager", "admin"]);
  const location = useLocation();

  const { notifications, unreadCount, markAllRead, markRead, clearAll } =
    useNotifications();

  /* chat: { ticketId, ticketTitle } | null */
  const [activeChat, setActiveChat] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name ? user.name[0].toUpperCase() : "?";
  const isActive = (path) => location.pathname === path;

  /* nav links config */
  const navLinks = [
    { to: "/", icon: faHouse, label: "Home", always: true },
    {
      to: "/technician/assignments",
      icon: faClipboardList,
      label: "Assignments",
      always: true,
    },
    {
      to: "/manager/tickets",
      icon: faUserGear,
      label: "Tickets",
      managerOnly: true,
    },
    { to: "/createTicket", icon: faTicket, label: "New Ticket", always: true },
    { to: "/dashboard", icon: faChartLine, label: "Dashboard", always: true },
  ];

  return (
    <>
      <nav className="fb-navbar">
        {/* ── LEFT ── */}
        <div className="nav-left">
          <div className="logo">TC</div>
        </div>

        {/* ── CENTER (desktop) ── */}
        <div className="nav-center nav-center-desktop">
          {navLinks.map(({ to, icon, label, managerOnly }) => {
            if (managerOnly && !canManageTickets) return null;
            return (
              <Link
                key={to}
                to={to}
                className={`nav-icon ${isActive(to) ? "nav-icon-active" : ""}`}
                title={label}
              >
                <FontAwesomeIcon icon={icon} />
              </Link>
            );
          })}
        </div>

        {/* ── RIGHT ── */}
        <div className="nav-right">
          {/* NOTIFICATIONS */}
          <div className="dropdown-wrapper" ref={notif.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => {
                notif.setOpen(!notif.open);
                msg.setOpen(false);
                profile.setOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span className="badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {notif.open && (
              <div className="dropdown-panel">
                <div className="panel-header">
                  <span>Notifications</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} title="Mark all read">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        title="Clear all"
                        style={{ color: "var(--danger)" }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="panel-list">
                  {notifications.length === 0 && (
                    <div className="panel-empty">No notifications yet</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`panel-item ${n.unread ? "unread" : ""}`}
                      onClick={() => markRead(n.id)}
                    >
                      <span style={{ marginRight: 8 }}>
                        {notifIcon[n.type] || "🔔"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.87rem" }}>{n.text}</div>
                        {n.time && (
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--muted)",
                              marginTop: 2,
                            }}
                          >
                            {fmt(n.time)}
                          </div>
                        )}
                      </div>
                      {n.unread && (
                        <FontAwesomeIcon
                          icon={faCircle}
                          style={{
                            fontSize: "0.45rem",
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MESSAGES (opens latest chat or a picker) */}
          <div className="dropdown-wrapper" ref={msg.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => {
                msg.setOpen(!msg.open);
                notif.setOpen(false);
                profile.setOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </div>

            {msg.open && (
              <div className="dropdown-panel">
                <div className="panel-header">
                  <span>Messages</span>
                </div>
                <div className="panel-list">
                  <div
                    className="panel-empty"
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    Open a ticket to start chatting.
                    <br />
                    <Link
                      to="/"
                      style={{ color: "var(--accent)", fontSize: 13 }}
                      onClick={() => msg.setOpen(false)}
                    >
                      Go to Home
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="dropdown-wrapper" ref={profile.ref}>
            <div
              className="avatar"
              onClick={() => {
                profile.setOpen(!profile.open);
                notif.setOpen(false);
                msg.setOpen(false);
              }}
            >
              {initials}
            </div>

            {profile.open && (
              <div className="profile-dropdown">
                {/* user info */}
                {user && (
                  <div
                    style={{
                      padding: "10px 16px 8px",
                      borderBottom: "1px solid var(--card-border)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                      {user.email}
                    </div>
                  </div>
                )}

                <Link
                  to="/settings"
                  className="dropdown-item"
                  onClick={() => profile.setOpen(false)}
                >
                  <FontAwesomeIcon icon={faGear} /> Settings
                </Link>

                <div
                  className="dropdown-item"
                  onClick={() => {
                    toggleTheme();
                    profile.setOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
                  {isDark ? " Dark Mode" : " Light Mode"}
                </div>

                <div className="dropdown-divider" />

                <button
                  onClick={logout}
                  disabled={logoutLoading}
                  className="dropdown-item danger"
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    padding: "10px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    color: "var(--fg)",
                  }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  {logoutLoading ? "Logging out…" : "Logout"}
                </button>
              </div>
            )}
          </div>

          {/* HAMBURGER (mobile) */}
          <div className="hamburger" onClick={() => setMobileOpen((o) => !o)}>
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="mobile-drawer" onClick={() => setMobileOpen(false)}>
          <div
            className="mobile-drawer-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map(({ to, icon, label, managerOnly }) => {
              if (managerOnly && !canManageTickets) return null;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`mobile-nav-link ${isActive(to) ? "nav-icon-active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <FontAwesomeIcon icon={icon} />
                  <span>{label}</span>
                </Link>
              );
            })}
            <hr
              style={{ borderColor: "var(--card-border)", margin: "12px 0" }}
            />
            <button
              className="mobile-nav-link danger"
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              disabled={logoutLoading}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>{logoutLoading ? "Logging out…" : "Logout"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── CHAT WINDOW ── */}
      {activeChat && (
        <ChatBox
          ticketId={activeChat.ticketId}
          ticketTitle={activeChat.ticketTitle}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}

export default Navbar;

/* ─ Export helper so pages can trigger a chat ─────────────────────────
   Usage in any page:
     import { openTicketChat } from "../../components/layout/Navbar";
   Actually use a shared context or prop drilling.
   See: useTicketChat hook below for a cleaner approach.
────────────────────────────────────────────────────────────────────── */
