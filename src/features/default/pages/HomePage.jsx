// src/features/default/pages/HomePage.jsx  (UPDATED)
// Shows the logged-in user's tickets with status, and a Chat button per ticket

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import ChatBox from "../../../components/ChatBox";
import { http } from "../../../services/api/http";
import { useAuthContext } from "../../auth/context/AuthContext";

/* ── Status badge ─────────────────────────────────────────── */
const statusConfig = {
  open: { label: "Open", bg: "#6c757d" },
  assigned: { label: "Assigned", bg: "#0d6efd" },
  in_progress: { label: "In Progress", bg: "#fd7e14" },
  resolved: { label: "Resolved", bg: "#198754" },
  closed: { label: "Closed", bg: "#343a40" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, bg: "#6c757d" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: "0.75rem",
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

/* ── Priority badge ───────────────────────────────────────── */
const priorityConfig = {
  low: { label: "Low", color: "#6c757d" },
  normal: { label: "Normal", color: "#0d6efd" },
  high: { label: "High", color: "#fd7e14" },
  critical: { label: "Critical", color: "#dc3545" },
};

function PriorityDot({ priority }) {
  if (!priority) return null;
  const cfg = priorityConfig[priority] || {};
  return (
    <span style={{ color: cfg.color, fontWeight: 700, fontSize: "0.8rem" }}>
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
  const [activeChat, setActiveChat] = useState(null); // { ticketId, ticketTitle }

  useEffect(() => {
    http
      .get("ticket")
      .then((res) => setTickets(res.data))
      .catch(() => setError("Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  const openTickets = tickets.filter(
    (t) => t.status !== "resolved" && t.status !== "closed",
  );
  const closedTickets = tickets.filter(
    (t) => t.status === "resolved" || t.status === "closed",
  );

  return (
    <>
      <Navbar />
      <div className="route-container">
        {/* ── Welcome banner ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #ff4500))",
            borderRadius: "var(--radius)",
            padding: "28px 32px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.4rem" }}>
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </h2>
            <p style={{ margin: "6px 0 0", opacity: 0.9, fontSize: "0.95rem" }}>
              You have <strong>{openTickets.length}</strong> open ticket
              {openTickets.length !== 1 ? "s" : ""}.
            </p>
          </div>
          <Link to="/createTicket" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#fff",
                color: "var(--accent)",
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "0.2s",
                whiteSpace: "nowrap",
              }}
            >
              + New Ticket
            </button>
          </Link>
        </div>

        {/* ── Error ── */}
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

        {/* ── Loading ── */}
        {loading && (
          <div
            style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}
          >
            Loading your tickets…
          </div>
        )}

        {/* ── Ticket sections ── */}
        {!loading && (
          <>
            <TicketSection
              title="Active Tickets"
              tickets={openTickets}
              onChat={(t) =>
                setActiveChat({
                  ticketId: t.id,
                  ticketTitle: t.title || `Ticket #${t.id}`,
                })
              }
              empty="No active tickets. Everything looks good! 🎉"
            />
            <TicketSection
              title="Resolved & Closed"
              tickets={closedTickets}
              onChat={(t) =>
                setActiveChat({
                  ticketId: t.id,
                  ticketTitle: t.title || `Ticket #${t.id}`,
                })
              }
              empty="No resolved tickets yet."
              muted
            />
          </>
        )}
      </div>

      {/* ── Chat window ── */}
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

/* ── Ticket section component ─────────────────────────────── */
function TicketSection({ title, tickets, onChat, empty, muted }) {
  return (
    <div>
      <h3
        style={{
          marginBottom: 14,
          fontSize: "1rem",
          fontWeight: 700,
          color: muted ? "var(--muted)" : "var(--fg)",
        }}
      >
        {title} ({tickets.length})
      </h3>

      {tickets.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{empty}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onChat={onChat} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Single ticket card ───────────────────────────────────── */
function TicketCard({ ticket, onChat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)",
        padding: "16px 20px",
        transition: "box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                fontWeight: 600,
              }}
            >
              #{ticket.id}
            </span>
            <StatusBadge status={ticket.status} />
            {ticket.priority && <PriorityDot priority={ticket.priority} />}
          </div>
          <div
            style={{
              marginTop: 6,
              fontWeight: 600,
              fontSize: "0.97rem",
              color: "var(--fg)",
            }}
          >
            {ticket.title || "(No title)"}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: "var(--glass)",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: "0.8rem",
              cursor: "pointer",
              color: "var(--fg)",
            }}
          >
            {expanded ? "Less ▲" : "More ▼"}
          </button>
          <button
            onClick={() => onChat(ticket)}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 8,
              padding: "5px 14px",
              fontSize: "0.8rem",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            💬 Chat
          </button>
        </div>
      </div>

      {/* Expandable description */}
      {expanded && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--card-border)",
            fontSize: "0.9rem",
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          {ticket.description || "No description provided."}
          {ticket.completed_at && (
            <div style={{ marginTop: 8, fontSize: "0.8rem" }}>
              Resolved at: {new Date(ticket.completed_at).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
