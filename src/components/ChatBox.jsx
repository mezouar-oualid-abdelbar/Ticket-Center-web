// src/components/ChatBox.jsx
// Real-time chat for a ticket.
// Props: ticketId (number), ticketTitle (string), onClose (fn)
//
// Who can chat:
//   • The user who created the ticket (reporter)
//   • The manager who dispatched it (dispatcher)
//   • The leader technician
//   • All technicians assigned via the pivot table
//
// Channel auth is enforced on the backend (routes/channels.php).
// The frontend just subscribes — Reverb rejects unauthorised users automatically.

import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/chatbox.css";
import { http } from "../services/api/http";
import echo from "../services/socket/echo";
import { useAuthContext } from "../features/auth/context/AuthContext";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

// ── Avatar initials bubble ──────────────────────────────────
function Avatar({ name, isMe }) {
  const initials = (name || "?")[0].toUpperCase();
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: isMe ? "var(--accent)" : "var(--glass)",
        border: "1px solid var(--card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: isMe ? "#fff" : "var(--fg)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function ChatBox({
  ticketId,
  ticketTitle = "Ticket Chat",
  onClose,
}) {
  const { user } = useAuthContext();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minimized, setMinimized] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── 1. Load message history ─────────────────────────────
  useEffect(() => {
    if (!ticketId) return;

    setLoading(true);
    setError("");

    http
      .get(`messages/${ticketId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError("You don't have access to this ticket's chat.");
        } else {
          setError("Failed to load messages. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [ticketId]);

  // ── 2. Subscribe to Reverb private channel ──────────────
  useEffect(() => {
    if (!ticketId) return;

    const channel = echo.private(`ticket.${ticketId}`);

    channel.listen(".message.sent", (data) => {
      const incoming = data.message;
      setMessages((prev) => {
        // Deduplicate by id
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });

    // Cleanup on unmount / ticketId change
    return () => {
      echo.leave(`ticket.${ticketId}`);
    };
  }, [ticketId]);

  // ── 3. Auto-scroll on new messages ─────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── 4. Send a message ──────────────────────────────────
  const sendMessage = useCallback(async () => {
    const value = text.trim();
    if (!value || sending || !ticketId) return;

    setSending(true);
    setText("");

    // Optimistic — show immediately, replace with real on success
    const optimisticId = `opt-${Date.now()}`;
    const optimistic = {
      id: optimisticId,
      ticket_id: ticketId,
      sender_id: user?.id,
      sender_name: user?.name || "You",
      message: value,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await http.post(`messages/${ticketId}`, { message: value });
      // Swap optimistic entry for the real one from the server
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? res.data : m)),
      );
    } catch {
      // Remove optimistic entry and restore input so user can retry
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setText(value);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [text, sending, ticketId, user]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Minimised bubble ────────────────────────────────────
  if (minimized) {
    return (
      <div
        className="messenger-bubble"
        onClick={() => setMinimized(false)}
        title="Open chat"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--accent)",
            borderRadius: "50%",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          💬
        </div>
      </div>
    );
  }

  // ── Full chat window ────────────────────────────────────
  return (
    <div className="messenger-window">
      {/* HEADER */}
      <div className="messenger-header">
        <div className="header-left">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            TC
          </div>
          <div>
            <div className="name" style={{ fontSize: "0.9rem" }}>
              {ticketTitle}
            </div>
            <div className="status">Ticket #{ticketId}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span
            onClick={() => setMinimized(true)}
            title="Minimise"
            style={{
              cursor: "pointer",
              color: "var(--muted)",
              fontSize: "1rem",
              lineHeight: 1,
            }}
          >
            —
          </span>
          {onClose && (
            <span
              onClick={onClose}
              title="Close"
              style={{
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              ✕
            </span>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="messenger-body">
        {/* Loading */}
        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              margin: "24px 0",
            }}
          >
            Loading messages…
          </p>
        )}

        {/* Access error */}
        {error && (
          <p
            style={{
              textAlign: "center",
              color: "var(--danger)",
              fontSize: 13,
              margin: "24px 12px",
            }}
          >
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading && !error && messages.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              margin: "32px 12px",
            }}
          >
            No messages yet — start the conversation.
          </p>
        )}

        {/* Messages */}
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === user?.id;
          const prev = messages[index - 1];
          const grouped = prev && prev.sender_id === msg.sender_id;

          return (
            <div
              key={msg.id}
              className={`msg-row ${isMe ? "user" : "bot"}`}
              style={{ alignItems: "flex-end" }}
            >
              {/* Avatar — left side, not grouped */}
              {!isMe && !grouped && (
                <Avatar name={msg.sender_name} isMe={false} />
              )}
              {!isMe && grouped && <div style={{ width: 28, flexShrink: 0 }} />}

              <div
                className={`msg-bubble ${isMe ? "user" : "bot"} ${grouped ? "grouped" : ""}`}
                title={fmt(msg.created_at)}
                style={{ opacity: msg._optimistic ? 0.6 : 1 }}
              >
                {/* Sender name — only for first in group, not self */}
                {!isMe && !grouped && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      marginBottom: 3,
                    }}
                  >
                    {msg.sender_name || "User"}
                  </div>
                )}

                {msg.message}

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: "0.65rem",
                    marginTop: 4,
                    textAlign: isMe ? "right" : "left",
                    opacity: 0.55,
                  }}
                >
                  {fmt(msg.created_at)}
                  {msg._optimistic && " · sending…"}
                </div>
              </div>

              {/* Avatar — right side for self */}
              {isMe && !grouped && <Avatar name={user?.name} isMe={true} />}
              {isMe && grouped && <div style={{ width: 28, flexShrink: 0 }} />}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <div className="messenger-footer" style={{ gap: 8 }}>
        <input
          ref={inputRef}
          placeholder={
            error ? "Chat unavailable" : "Type a message… (Enter to send)"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          disabled={sending || !!error}
          style={{ flex: 1 }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending || !!error}
          style={{
            background: "var(--accent)",
            border: "none",
            color: "#fff",
            padding: "0 16px",
            borderRadius: 20,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
            height: 34,
            opacity: !text.trim() || sending || !!error ? 0.45 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {sending ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
