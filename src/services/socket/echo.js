// src/services/socket/echo.js
// Laravel Reverb (self-hosted WebSocket, no Pusher cloud needed)

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

// Derive the API base without the trailing /api so we can build the auth URL
const apiBase =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const serverBase = apiBase.replace(/\/api\/?$/, ""); // → http://localhost:8000

const echo = new Echo({
  broadcaster: "reverb",

  key: import.meta.env.VITE_REVERB_APP_KEY || "ticketcenter-key",

  wsHost: import.meta.env.VITE_REVERB_HOST || "localhost",
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,

  forceTLS: (import.meta.env.VITE_REVERB_SCHEME || "http") === "https",
  enabledTransports: ["ws", "wss"],
  disableStats: true,

  // Private channel auth — hits POST /api/broadcasting/auth with the Bearer token
  authEndpoint: `${apiBase.replace(/\/?$/, "")}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      Accept: "application/json",
    },
  },
});

/**
 * Call this after login so the Echo instance picks up the fresh token.
 * Import and call it from your login hook after saving the token.
 *
 * Usage:
 *   import { refreshEchoAuth } from "../services/socket/echo";
 *   refreshEchoAuth();
 */
export function refreshEchoAuth() {
  const token = localStorage.getItem("token") || "";
  if (echo.connector?.pusher?.config?.auth) {
    echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token}`;
  }
  // Also update the options object for any new subscriptions
  if (echo.options?.auth?.headers) {
    echo.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export default echo;
