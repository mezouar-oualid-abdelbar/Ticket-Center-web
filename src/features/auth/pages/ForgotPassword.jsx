// src/features/auth/pages/ForgotPassword.jsx
// Sends a password-reset link to the user's email

import { useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../../services/api/http";
import "../login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }

    setIsLoading(true);
    try {
      await http.post("forgot-password", { email });
      setSuccess("If that email exists in our system, a reset link has been sent. Check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fb-container">
      <div className="fb-left">
        <h1>ticket center</h1>
        <p>We&apos;ll send you a secure link to reset your password.</p>
      </div>

      <div className="fb-right">
        <div className="login-box">
          <h2 style={{ color: "var(--accent)", marginBottom: 6, textAlign: "center" }}>Forgot Password</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
            Enter your account email and we&apos;ll send a reset link.
          </p>

          {error && <p className="error-message server-error">{error}</p>}

          {success ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--accent)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                ✓ {success}
              </p>
              <Link to="/login" style={{ color: "var(--accent)", fontSize: 14 }}>← Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                disabled={isLoading}
              />

              <button className="login-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Sending…" : "Send Reset Link"}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
                <Link to="/login" style={{ color: "var(--accent)" }}>← Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
