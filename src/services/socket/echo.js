import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const apiBase =
  import.meta.env.VITE_API_BASE_URL || "http://striker67.duckdns.org:8000/api";

const echo = new Echo({
  broadcaster: "reverb",

  key: import.meta.env.VITE_REVERB_APP_KEY || "ticketcenter-key",

  wsHost: import.meta.env.VITE_REVERB_HOST || "striker67.duckdns.org",

  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,

  forceTLS: false,

  enabledTransports: ["ws"],

  authEndpoint: `${apiBase}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      Accept: "application/json",
    },
  },
});

export function refreshEchoAuth() {
  const token = localStorage.getItem("token") || "";

  if (echo.connector?.pusher?.config?.auth?.headers) {
    echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token}`;
  }

  if (echo.options?.auth?.headers) {
    echo.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export default echo;
