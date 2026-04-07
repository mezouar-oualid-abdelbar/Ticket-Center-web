// src/features/auth/pages/Login.jsx

import "../login.css";
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
            {/* Server-level error */}
            {serverError && (
              <p className="error-message server-error">{serverError}</p>
            )}

            {/* Email */}
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

            {/* Password */}
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

            {/* <a href="/forgot-password" className="forgot">
              Forgotten password?
            </a>

            <hr />

            <button
              type="button"
              className="signup-btn"
              onClick={() => (window.location.href = "/register")}
            >
              Create New Account
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
