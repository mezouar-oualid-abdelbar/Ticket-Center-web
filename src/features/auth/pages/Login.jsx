// src/features/auth/pages/Login.jsx  (UPDATED — links now active)

import "../login.css";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

function Login() {
  const {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="fb-container">
      {/* Left Side */}
      <div className="fb-left">
        <h1>ticket center</h1>
        <p>ticket center helps you report your problems.</p>
      </div>

      {/* Right Side */}
      <div className="fb-right">
        <div className="login-box">
          <form onSubmit={handleSubmit} noValidate>
            {serverError && (
              <p className="error-message server-error">{serverError}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              disabled={isLoading}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <Link to="/forgot-password" className="forgot">
              Forgotten password?
            </Link>

            <hr />

            <Link to="/register">
              <button
                type="button"
                className="signup-btn"
                style={{ width: "100%" }}
              >
                Create New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
