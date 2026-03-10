import { useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New assignment created", unread: true },
    { id: 2, text: "Technician updated status", unread: true },
    { id: 3, text: "Report generated", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
  };
}
