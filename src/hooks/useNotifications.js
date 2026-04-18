// src/hooks/useNotifications.js
// Listens on the user's private Reverb channel for real-time events.
// Also requests OS/browser notification permission and fires them.

import { useState, useEffect, useCallback } from "react";
import echo from "../services/socket/echo";
import { useAuthContext } from "../features/auth/context/AuthContext";

/* ── Request OS notification permission once ── */
function requestOsPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

/* ── Fire an OS notification if permitted ── */
function fireOsNotification(title, body, icon = "/favicon.ico") {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon });
    } catch {
      // some browsers block in certain contexts — ignore
    }
  }
}

export function useNotifications() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);

  // ── Request OS permission on first render ──
  useEffect(() => {
    requestOsPermission();
  }, []);

  const addNotification = useCallback((text, type = "info", meta = {}) => {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        type,
        meta, // { ticketId, ticketTitle } — used by messages dropdown
        unread: true,
        time: new Date(),
      },
      ...prev,
    ]);
  }, []);

  // ── Subscribe to private channel ──
  useEffect(() => {
    if (!user?.id) return;

    const channel = echo.private(`users.${user.id}`);

    // Ticket assigned to this user (technician)
    channel.listen(".ticket.assigned", (data) => {
      const title = `Assigned: ${data.ticket_title ?? "#" + data.ticket_id}`;
      addNotification(title, "assignment", { ticketId: data.ticket_id });
      fireOsNotification("New Assignment", title);
    });

    // Ticket you created is resolved
    channel.listen(".ticket.resolved", (data) => {
      const title = `Resolved: ${data.ticket_title ?? "#" + data.ticket_id}`;
      addNotification(title, "resolved", { ticketId: data.ticket_id });
      fireOsNotification("Ticket Resolved", title);
    });

    // New chat message on a ticket you're involved in
    channel.listen(".message.received", (data) => {
      const text = `💬 ${data.sender_name}: ${data.preview ?? ""}`;
      addNotification(text, "message", {
        ticketId: data.ticket_id,
        ticketTitle: data.ticket_title,
      });
      fireOsNotification(
        `New message — ${data.ticket_title ?? "Ticket"}`,
        `${data.sender_name}: ${data.preview ?? ""}`,
      );
    });

    return () => {
      echo.leave(`users.${user.id}`);
    };
  }, [user?.id, addNotification]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // How many unread message notifications (for the envelope badge)
  const unreadMessages = notifications.filter(
    (n) => n.unread && n.type === "message",
  );

  const markAllRead = useCallback(
    () => setNotifications((p) => p.map((n) => ({ ...n, unread: false }))),
    [],
  );

  const markRead = useCallback(
    (id) =>
      setNotifications((p) =>
        p.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      ),
    [],
  );

  const clearAll = useCallback(() => setNotifications([]), []);

  return {
    notifications,
    unreadCount,
    unreadMessages, // ← used by messages dropdown
    markAllRead,
    markRead,
    clearAll,
    addNotification,
  };
}
