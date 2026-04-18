// src/features/default/pages/HomePage.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import ChatBox from "../../../components/ChatBox";
import { http } from "../../../services/api/http";
import { useAuthContext } from "../../auth/context/AuthContext";

/* ── Helpers ─────────────────────────────────────────────── */
const STATUS = {
  open: { label: "Open", bg: "#6c757d" },
  assigned: { label: "Assigned", bg: "#0d6efd" },
  in_progress: { label: "In Progress", bg: "#fd7e14" },
};
const PRIORITY = {
  low: { label: "Low", color: "#6c757d" },
  normal: { label: "Normal", color: "#0d6efd" },
  high: { label: "High", color: "#fd7e14" },
  critical: { label: "Critical", color: "#dc3545" },
};

function StatusBadge({ status }) {
  const cfg = STATUS[status] || { label: status, bg: "#6c757d" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: "0.72rem",
        fontWeight: 700,
        background: cfg.bg,
        color: "#fff",
        textTransform: "capitalize",
      }}
    >
      {cfg.label}
    </span>
  );
}

function PriorityTag({ priority }) {
  if (!priority) return null;
  const cfg = PRIORITY[priority] || {};
  return (
    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: cfg.color }}>
      ● {cfg.label}
    </span>
  );
}

/* ── Main ─────────────────────────────────────────────────── */
export default function HomePage() {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    // GET /api/my-tickets — only unresolved tickets where user is involved
    http
      .get("my-tickets")
      .then((r) => setTickets(r.data))
      .catch(() => setError("Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  const openChat = (t) =>
    setActiveChat({
      ticketId: t.id,
      ticketTitle: t.title || `Ticket #${t.id}`,
    });

  return (
    <>
      <Navbar />
      <div className="route-container">
        {/* Banner */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--accent), color-mix(in srgb,var(--accent) 70%,#ff4500))",
            borderRadius: "var(--radius)",
            padding: "24px 28px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.3rem" }}>
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </h2>
            <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "0.9rem" }}>
              {tickets.length === 0 && !loading
                ? "No active tickets — all clear! 🎉"
                : `${tickets.length} active ticket${tickets.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link to="/createTicket" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#fff",
                color: "var(--accent)",
                border: "none",
                borderRadius: 10,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + New Ticket
            </button>
          </Link>
        </div>

        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        {loading && (
          <p
            style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}
          >
            Loading…
          </p>
        )}

        {!loading && tickets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onChat={openChat} />
            ))}
          </div>
        )}
      </div>

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

/* ── Ticket card (no "More" button) ──────────────────────── */
function TicketCard({ ticket, onChat }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)",
        padding: "14px 18px",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {/* Left: info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                fontWeight: 600,
              }}
            >
              #{ticket.id}
            </span>
            <StatusBadge status={ticket.status} />
            {ticket.priority && <PriorityTag priority={ticket.priority} />}
          </div>
          <div
            style={{
              marginTop: 5,
              fontWeight: 600,
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {ticket.title || "(No title)"}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: "0.82rem",
              color: "var(--muted)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {ticket.description}
          </div>
        </div>

        {/* Right: chat button only */}
        <button
          onClick={() => onChat(ticket)}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: "0.82rem",
            cursor: "pointer",
            color: "#fff",
            fontWeight: 600,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
}
