// src/features/auth/pages/Register.jsx
// Two-step: 1) fill form → 2) enter email verification code

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../../../services/api/http";
import "../login.css";

/* ─── helpers ─────────────────────────────────────────────── */
function validate({ name, email, password, password_confirmation }) {
  const e = {};
  if (!name.trim()) e.name = "Name is required.";
  else if (name.trim().length < 3) e.name = "Name must be at least 3 characters.";
  if (!email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 6) e.password = "Password must be at least 6 characters.";
  if (password !== password_confirmation) e.password_confirmation = "Passwords do not match.";
  return e;
}

/* ─── OTP Input ──────────────────────────────────────────── */
function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = (value + "      ").slice(0, 6).split("");

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      next[i] = " ";
      onChange(next.join("").trimEnd());
      if (i > 0) refs[i - 1].current.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = [...digits];
      next[i] = e.key;
      onChange(next.join("").trimEnd());
      if (i < 5) refs[i + 1].current.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onKeyDown={(e) => handleKey(i, e)}
          onChange={() => {}}
          onClick={() => refs[i].current.select()}
          style={{
            width: 44,
            height: 52,
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 700,
            borderRadius: 10,
            border: "1.5px solid var(--card-border)",
            background: "var(--bg)",
            color: "var(--fg)",
            outline: "none",
            transition: "border-color .2s, box-shadow .2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = verify
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  /* countdown timer for resend */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (serverError) setServerError("");
  };

  /* STEP 1: register → backend sends email code */
  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    setServerError("");
    try {
      await http.post("register", form);
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, msgs]) => { mapped[k] = msgs[0]; });
        setErrors(mapped);
      } else {
        setServerError(data?.message || "Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* STEP 2: submit verification code */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g, "").length < 6) { setServerError("Please enter the 6-digit code."); return; }
    setIsLoading(true);
    setServerError("");
    try {
      await http.post("verify-email", { email: form.email, code: otp.replace(/\s/g, "") });
      setSuccessMsg("Email verified! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  /* Resend code */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setServerError("");
    try {
      await http.post("resend-verification", { email: form.email });
      setResendCooldown(60);
      setSuccessMsg("A new code has been sent.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not resend.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── STEP 2: verify screen ── */
  if (step === 2) {
    return (
      <div className="fb-container">
        <div className="fb-left">
          <h1>ticket center</h1>
          <p>Check your inbox for the 6-digit code.</p>
        </div>
        <div className="fb-right">
          <div className="login-box">
            <h2 style={{ textAlign: "center", color: "var(--accent)", marginBottom: 4 }}>Verify your email</h2>
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>
              We sent a code to <strong>{form.email}</strong>
            </p>

            {serverError && <p className="error-message server-error">{serverError}</p>}
            {successMsg && <p style={{ color: "var(--accent)", textAlign: "center", fontSize: 14 }}>{successMsg}</p>}

            <form onSubmit={handleVerify} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <OtpInput value={otp} onChange={setOtp} />

              <button className="login-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Verifying…" : "Verify Email"}
              </button>

              <div style={{ textAlign: "center", fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>Didn&apos;t receive it? </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  style={{ background: "none", border: "none", color: resendCooldown > 0 ? "var(--muted)" : "var(--accent)", cursor: resendCooldown > 0 ? "default" : "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>

              <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                ← Go back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── STEP 1: register form ── */
  return (
    <div className="fb-container">
      <div className="fb-left">
        <h1>ticket center</h1>
        <p>Create an account to report and track your issues.</p>
      </div>
      <div className="fb-right">
        <div className="login-box">
          {serverError && <p className="error-message server-error">{serverError}</p>}

          <form onSubmit={handleRegister} noValidate>
            {/* Name */}
            <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} className={errors.name ? "input-error" : ""} disabled={isLoading} />
            {errors.name && <p className="error-message">{errors.name}</p>}

            {/* Email */}
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} className={errors.email ? "input-error" : ""} disabled={isLoading} />
            {errors.email && <p className="error-message">{errors.email}</p>}

            {/* Password */}
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={errors.password ? "input-error" : ""} disabled={isLoading} />
            {errors.password && <p className="error-message">{errors.password}</p>}

            {/* Confirm Password */}
            <input type="password" name="password_confirmation" placeholder="Confirm password" value={form.password_confirmation} onChange={handleChange} className={errors.password_confirmation ? "input-error" : ""} disabled={isLoading} />
            {errors.password_confirmation && <p className="error-message">{errors.password_confirmation}</p>}

            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create Account"}
            </button>

            <hr />

            <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
