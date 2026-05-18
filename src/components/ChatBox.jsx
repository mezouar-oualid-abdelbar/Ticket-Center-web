// src/components/ChatBox.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/chatbox.css";
import { http } from "../services/api/http";
import echo from "../services/socket/echo";
import { useAuthContext } from "../features/auth/context/AuthContext";

const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

// A message is a system notice if the backend flagged it OR it has no sender
const isSystemMsg = (msg) =>
  msg.type === "system" ||
  msg.sender_id === null ||
  msg.sender_id === undefined;

function Avatar({ name, isMe }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        flexShrink: 0,
        background: isMe ? "var(--accent)" : "var(--glass)",
        border: "1px solid var(--card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: isMe ? "#fff" : "var(--fg)",
        userSelect: "none",
      }}
    >
      {(name || "?")[0].toUpperCase()}
    </div>
  );
}

// ── Centered system notice — no avatar, no bubble ────────────
function SystemMessage({ message, created_at }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          textAlign: "center",
          border: "1.5px solid #e53e3e",
          borderRadius: 8,
          padding: "8px 14px",
          background: "rgba(229, 62, 62, 0.06)",
          maxWidth: 300,
        }}
      >
        {/* App name label */}
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#e53e3e",
            letterSpacing: "0.04em",
            userSelect: "none",
          }}
        >
          Ticket Center
        </span>

        {/* Message text */}
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
          title={fmtTime(created_at)}
        >
          {message}
        </span>

        {/* Timestamp */}
        <span
          style={{ fontSize: "0.62rem", color: "var(--muted)", opacity: 0.55 }}
        >
          {fmtTime(created_at)}
        </span>
      </div>
    </div>
  );
}

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
  const seenIds = useRef(new Set());

  // ── 1. Load history ──────────────────────────────────────
  useEffect(() => {
    if (!ticketId) return;
    setLoading(true);
    setError("");
    seenIds.current.clear();

    http
      .get(`messages/${ticketId}`)
      .then((res) => {
        const msgs = res.data;
        msgs.forEach((m) => seenIds.current.add(m.id));
        setMessages(msgs);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "You don't have access to this ticket's chat."
            : "Failed to load messages.",
        );
      })
      .finally(() => setLoading(false));
  }, [ticketId]);

  // ── 2. Subscribe to Reverb ──────────────────────────────
  useEffect(() => {
    if (!ticketId) return;

    const channel = echo.private(`ticket.${ticketId}`);

    channel.listen(".message.sent", ({ message: incoming }) => {
      if (seenIds.current.has(incoming.id)) return;
      seenIds.current.add(incoming.id);

      setMessages((prev) => {
        const optIdx = prev.findIndex(
          (m) =>
            m._opt &&
            m.sender_id === incoming.sender_id &&
            m.message === incoming.message,
        );
        if (optIdx !== -1) {
          const next = [...prev];
          next[optIdx] = incoming;
          return next;
        }
        return [...prev, incoming];
      });
    });

    channel.listen(".system.message", ({ message: incoming }) => {
      if (seenIds.current.has(incoming.id)) return;
      seenIds.current.add(incoming.id);
      setMessages((prev) => [...prev, { ...incoming, type: "system" }]);
    });

    return () => echo.leave(`ticket.${ticketId}`);
  }, [ticketId]);

  // ── 3. Auto-scroll ──────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── 4. Send ─────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const value = text.trim();
    if (!value || sending || !ticketId) return;

    setSending(true);
    setText("");

    const tempId = `opt-${Date.now()}`;
    const optimistic = {
      id: tempId,
      ticket_id: ticketId,
      sender_id: user?.id,
      sender_name: user?.name || "You",
      message: value,
      created_at: new Date().toISOString(),
      _opt: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const { data: real } = await http.post(`messages/${ticketId}`, {
        message: value,
      });

      seenIds.current.add(real.id);

      setMessages((prev) => {
        const replaced = prev.map((m) => (m.id === tempId ? real : m));
        return replaced.filter(
          (m, i, arr) =>
            m.id !== real.id || arr.findIndex((x) => x.id === real.id) === i,
        );
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
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

  // ── Minimised bubble ─────────────────────────────────────
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

  // ── Full window ──────────────────────────────────────────
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
              fontSize: "1.1rem",
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
              }}
            >
              ✕
            </span>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="messenger-body">
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

        {messages.map((msg, i) => {
          // ── System message ───────────────────────────────
          if (isSystemMsg(msg)) {
            return (
              <SystemMessage
                key={msg.id}
                message={msg.message}
                created_at={msg.created_at}
              />
            );
          }

          // ── Regular chat message ─────────────────────────
          const isMe = msg.sender_id === user?.id;
          const prev = messages[i - 1];
          const grouped =
            prev && !isSystemMsg(prev) && prev.sender_id === msg.sender_id;

          return (
            <div
              key={msg.id}
              className={`msg-row ${isMe ? "user" : "bot"}`}
              style={{ alignItems: "flex-end" }}
            >
              {!isMe && !grouped && (
                <Avatar name={msg.sender_name} isMe={false} />
              )}
              {!isMe && grouped && <div style={{ width: 28, flexShrink: 0 }} />}

              <div
                className={`msg-bubble ${isMe ? "user" : "bot"} ${grouped ? "grouped" : ""}`}
                title={fmtTime(msg.created_at)}
                style={{ opacity: msg._opt ? 0.6 : 1 }}
              >
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
                <div
                  style={{
                    fontSize: "0.65rem",
                    marginTop: 4,
                    textAlign: isMe ? "right" : "left",
                    opacity: 0.55,
                  }}
                >
                  {fmtTime(msg.created_at)}
                  {msg._opt && " · sending…"}
                </div>
              </div>

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
          placeholder={error ? "Chat unavailable" : "Message… (Enter to send)"}
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
