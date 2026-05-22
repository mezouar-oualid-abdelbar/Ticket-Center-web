import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;

const apiBase =
  import.meta.env.VITE_API_BASE_URL || "http://realtime-api:8000/api";
const serverBase = apiBase.replace(/\/api\/?$/, "");

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY || "ticketcenter-key",
  wsHost: import.meta.env.VITE_REVERB_HOST || "realtime-api",
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME || "http") === "https",
  enabledTransports: ["ws", "wss"],
  disableStats: true,
  authEndpoint: `${apiBase.replace(/\/?$/, "")}/broadcasting/auth`,
  auth: {
    headers: {
      // ← read from localStorage every time a channel auth request fires
      get Authorization() {
        return `Bearer ${localStorage.getItem("token") || ""}`;
      },
      Accept: "application/json",
    },
  },
});

export function refreshEchoAuth() {
  const token = localStorage.getItem("token") || "";
  if (echo.connector?.pusher?.config?.auth) {
    echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token}`;
  }
  if (echo.options?.auth?.headers) {
    echo.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export default echo;
