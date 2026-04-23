import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://api:8000/api/",
});

// REQUEST INTERCEPTOR (add token)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE INTERCEPTOR (handle errors globally)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    // 🔥 Handle role error
    if (message === "User does not have the right roles.") {
      window.location.href = "/unauthorized"; // redirect
    }

    // Optional: handle unauthenticated (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
