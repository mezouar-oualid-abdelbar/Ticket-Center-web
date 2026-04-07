// src/features/auth/validation.js

export function validateLoginForm({ email, password }) {
  const errors = {};

  // Email validation
  if (!email || email.trim() === "") {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Password validation
  if (!password || password.trim() === "") {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors; // empty object means no errors
}
