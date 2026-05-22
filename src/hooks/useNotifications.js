// src/hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from "react";
import { http } from "../services/api/http";
import { useAuthContext } from "../features/auth/context/AuthContext";
import echo from "../services/socket/echo";

const normalize = (n) => ({
  id: n.id,
  text: n.message,
  type: n.type,
  unread: !n.is_read,
  time: n.created_at,
  meta: {
    ticketId: n.related_type?.includes("Ticket") ? n.related_id : null,
    ticketTitle: n.title,
  },
});

export function useNotifications() {
  const { user } = useAuthContext();

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`notifs_${user?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchedIds = useRef(new Set());

  // ── persist ──
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`notifs_${user.id}`, JSON.stringify(notifications));
    } catch {}
  }, [notifications, user]);

  // ── fetch + reset when user changes ──
  useEffect(() => {
    if (!user) {
      setNotifications([]); // ← clear when logged out
      fetchedIds.current = new Set();
      return;
    }

    // Reset before loading the new user's notifications
    setNotifications([]);
    fetchedIds.current = new Set();

    // Load from localStorage for THIS user first (instant paint)
    try {
      const saved = localStorage.getItem(`notifs_${user.id}`);
      if (saved) setNotifications(JSON.parse(saved));
    } catch {}

    // Then fetch fresh from server
    http.get("notifications").then((r) => {
      const items = (r.data?.data ?? r.data ?? []).map(normalize);
      items.forEach((n) => fetchedIds.current.add(n.id));
      setNotifications(items);
    });
  }, [user?.id]); // ← key on user.id, not the whole user object

  // ── WebSocket — re-subscribe when user.id changes ──
  useEffect(() => {
    if (!user?.id) return;

    const channelName = `users.${user.id}`;

    echo.private(channelName).listen(".notification.sent", (e) => {
      const incoming = normalize(e);
      if (fetchedIds.current.has(incoming.id)) return;
      fetchedIds.current.add(incoming.id);
      setNotifications((prev) => [incoming, ...prev]);
    });

    return () => {
      echo.leave(channelName); // ← always leave the OLD user's channel on cleanup
    };
  }, [user?.id]); // ← key on user.id so it resubscribes on user switch

  const unreadCount = notifications.filter((n) => n.unread).length;
  const unreadMessages = notifications.filter(
    (n) => n.unread && n.type === "message",
  );

  const markRead = useCallback(async (id) => {
    await http.patch(`notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await http.patch("notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearAll = useCallback(async () => {
    await http.delete("notifications");
    localStorage.removeItem(`notifs_${user?.id}`);
    setNotifications([]);
    fetchedIds.current = new Set();
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    unreadMessages,
    markRead,
    markAllRead,
    clearAll,
  };
}
