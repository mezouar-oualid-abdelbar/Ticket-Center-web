// src/components/layout/Navbar.jsx

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
import { useState, useEffect } from "react";

import { useTheme } from "../../hooks/useTheme";
import { useDropdown } from "../../hooks/useDropdown";
import { useNotifications } from "../../hooks/useNotifications";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../features/auth/context/AuthContext";
import { http } from "../../services/api/http";
import ChatBox from "../ChatBox";

const notifIcon = {
  assignment: "📋",
  resolved: "✅",
  message: "💬",
  info: "ℹ️",
};
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const statusLabel = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
};
const statusColor = {
  open: "#6c757d",
  assigned: "#0d6efd",
  in_progress: "#fd7e14",
};

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { logout, loading: logoutLoading } = useLogout();
  const { user } = useAuthContext();
  const profile = useDropdown();
  const notif = useDropdown();
  const msgDropdown = useDropdown();
  const canManageTickets = useHasRole(["manager", "admin"]);
  const location = useLocation();

  const {
    notifications,
    unreadCount,
    unreadMessages,
    markAllRead,
    markRead,
    clearAll,
  } = useNotifications();

  const [activeChat, setActiveChat] = useState(null); // { ticketId, ticketTitle }
  const [mobileOpen, setMobileOpen] = useState(false);
  const [myTickets, setMyTickets] = useState([]);

  // Load the user's unresolved tickets for the messages dropdown
  useEffect(() => {
    if (!user) return;
    http
      .get("my-tickets")
      .then((r) => setMyTickets(r.data))
      .catch(() => {});
  }, [user]);

  const initials = user?.name ? user.name[0].toUpperCase() : "?";
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", icon: faHouse, label: "Home" },
    {
      to: "/technician/assignments",
      icon: faClipboardList,
      label: "Assignments",
    },
    {
      to: "/manager/tickets",
      icon: faUserGear,
      label: "Tickets",
      managerOnly: true,
    },
    { to: "/createTicket", icon: faTicket, label: "New Ticket" },
  ];

  const closeAll = () => {
    notif.setOpen(false);
    msgDropdown.setOpen(false);
    profile.setOpen(false);
  };

  const openChat = (ticket) => {
    setActiveChat({
      ticketId: ticket.id,
      ticketTitle: ticket.title || `Ticket #${ticket.id}`,
    });
    msgDropdown.setOpen(false);
  };

  return (
    <>
      <nav className="fb-navbar">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo">TC</div>
        </div>

        {/* CENTER */}
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

        {/* RIGHT */}
        <div className="nav-right">
          {/* ── MESSAGES dropdown ── */}
          <div className="dropdown-wrapper" ref={msgDropdown.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => {
                closeAll();
                msgDropdown.setOpen(!msgDropdown.open);
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              {unreadMessages.length > 0 && (
                <span className="badge">
                  {unreadMessages.length > 9 ? "9+" : unreadMessages.length}
                </span>
              )}
            </div>

            {msgDropdown.open && (
              <div className="dropdown-panel">
                <div className="panel-header">
                  <span>Messages</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    {myTickets.length} active ticket
                    {myTickets.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="panel-list">
                  {myTickets.length === 0 ? (
                    <div className="panel-empty">No active tickets</div>
                  ) : (
                    myTickets.map((t) => (
                      <div
                        key={t.id}
                        className="panel-item"
                        onClick={() => openChat(t)}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.87rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {t.title || `Ticket #${t.id}`}
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--muted)",
                              marginTop: 2,
                            }}
                          >
                            #{t.id}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: statusColor[t.status] || "#6c757d",
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {statusLabel[t.status] || t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── NOTIFICATIONS dropdown ── */}
          <div className="dropdown-wrapper" ref={notif.ref}>
            <div
              className="nav-icon badge-wrapper"
              onClick={() => {
                closeAll();
                notif.setOpen(!notif.open);
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
                  <div style={{ display: "flex", gap: 6 }}>
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
                  {notifications.length === 0 ? (
                    <div className="panel-empty">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`panel-item ${n.unread ? "unread" : ""}`}
                        onClick={() => {
                          markRead(n.id);
                          if (n.meta?.ticketId) {
                            openChat({
                              id: n.meta.ticketId,
                              title: n.meta.ticketTitle,
                            });
                          }
                        }}
                      >
                        <span style={{ marginRight: 8, flexShrink: 0 }}>
                          {notifIcon[n.type] || "🔔"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{ fontSize: "0.85rem", lineHeight: 1.35 }}
                          >
                            {n.text}
                          </div>
                          {n.time && (
                            <div
                              style={{
                                fontSize: "0.7rem",
                                color: "var(--muted)",
                                marginTop: 2,
                              }}
                            >
                              {fmtTime(n.time)}
                            </div>
                          )}
                        </div>
                        {n.unread && (
                          <FontAwesomeIcon
                            icon={faCircle}
                            style={{
                              fontSize: "0.4rem",
                              color: "var(--accent)",
                              flexShrink: 0,
                              marginLeft: 6,
                            }}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── PROFILE ── */}
          <div className="dropdown-wrapper" ref={profile.ref}>
            <div
              className="avatar"
              onClick={() => {
                closeAll();
                profile.setOpen(!profile.open);
              }}
            >
              {initials}
            </div>

            {profile.open && (
              <div className="profile-dropdown">
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
                  onClick={() => {
                    logout();
                    profile.setOpen(false);
                  }}
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

          {/* ── HAMBURGER ── */}
          <div className="hamburger" onClick={() => setMobileOpen((o) => !o)}>
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
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

      {/* CHAT WINDOW */}
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
