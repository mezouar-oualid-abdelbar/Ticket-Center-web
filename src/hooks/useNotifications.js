// src/hooks/useNotifications.js
// Listens to the user's private Pusher channel for real-time notifications
// and merges them with any fetched from the API (future: GET /api/notifications)

import { useState, useEffect, useCallback, useRef } from "react";
import echo from "../services/socket/echo";
import { useAuthContext } from "../features/auth/context/AuthContext";

export function useNotifications() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const channelRef = useRef(null);

  // Prepend a new notification
  const addNotification = useCallback((text, type = "info") => {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        type, // "assignment" | "resolved" | "info"
        unread: true,
        time: new Date(),
      },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Private channel scoped to this user
    const channel = echo.private(`users.${user.id}`);
    channelRef.current = channel;

    // ── Ticket assigned to this user (technician gets this) ──
    channel.listen(".ticket.assigned", (data) => {
      addNotification(
        `You have been assigned to ticket: "${data.ticket_title || "#" + data.ticket_id}"`,
        "assignment",
      );
    });

    // ── Ticket you created is now resolved ──
    channel.listen(".ticket.resolved", (data) => {
      addNotification(
        `Your ticket "${data.ticket_title || "#" + data.ticket_id}" has been resolved.`,
        "resolved",
      );
    });

    // ── Ticket dispatched by this manager is complete ──
    channel.listen(".ticket.completed", (data) => {
      addNotification(
        `Ticket "${data.ticket_title || "#" + data.ticket_id}" you dispatched is now complete.`,
        "resolved",
      );
    });

    // ── New chat message on a ticket you're involved in ──
    channel.listen(".message.received", (data) => {
      addNotification(
        `New message from ${data.sender_name || "someone"}: "${data.preview || ""}"`,
        "message",
      );
    });

    return () => {
      echo.leave(`users.${user.id}`);
      channelRef.current = null;
    };
  }, [user?.id, addNotification]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    clearAll,
    addNotification,
  };
}
