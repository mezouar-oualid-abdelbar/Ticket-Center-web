// src/features/auth/pages/ResetPassword.jsx
// User lands here from the email link: /reset-password?token=xxx&email=yyy

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { http } from "../../../services/api/http";
import "../login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const emailFromUrl = params.get("email") || "";

  const [form, setForm] = useState({ email: emailFromUrl, password: "", password_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.password !== form.password_confirmation) e.password_confirmation = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!token) { setServerError("Invalid or missing reset token. Please request a new link."); return; }

    setIsLoading(true);
    setServerError("");
    try {
      await http.post("reset-password", { token, ...form });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, msgs]) => { mapped[k] = msgs[0]; });
        setErrors(mapped);
      } else {
        setServerError(data?.message || "Reset failed. The link may have expired.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="fb-container">
        <div className="fb-right">
          <div className="login-box" style={{ textAlign: "center" }}>
            <p className="error-message server-error">Invalid reset link.</p>
            <Link to="/forgot-password" style={{ color: "var(--accent)" }}>Request a new one</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-container">
      <div className="fb-left">
        <h1>ticket center</h1>
        <p>Choose a new secure password for your account.</p>
      </div>

      <div className="fb-right">
        <div className="login-box">
          <h2 style={{ color: "var(--accent)", marginBottom: 6, textAlign: "center" }}>Reset Password</h2>

          {success ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 12 }}>
                ✓ Password updated! Redirecting to login…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {serverError && <p className="error-message server-error">{serverError}</p>}

              {/* Email (pre-filled, but editable if URL param was missing) */}
              <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} disabled={isLoading} />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <input type="password" name="password" placeholder="New password" value={form.password} onChange={handleChange} disabled={isLoading} />
              {errors.password && <p className="error-message">{errors.password}</p>}

              <input type="password" name="password_confirmation" placeholder="Confirm new password" value={form.password_confirmation} onChange={handleChange} disabled={isLoading} />
              {errors.password_confirmation && <p className="error-message">{errors.password_confirmation}</p>}

              <button className="login-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Updating…" : "Reset Password"}
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
