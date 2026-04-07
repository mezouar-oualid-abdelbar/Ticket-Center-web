// src/features/assignments/Appointment.jsx
import React, { useState } from "react";
import { makeAppointment } from "../api";
import { validateAppointment } from "../validations/appointment";

export default function Appointment({ ticketId, onSuccess }) {
  const [formData, setFormData] = useState({ datetime: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate date
    const errors = validateAppointment(formData);
    if (Object.keys(errors).length > 0) {
      return setError(errors.datetime);
    }

    // ✅ Make sure ticketId and leaderId exist
    if (!ticketId) {
      return setError("Missing ticket ID.");
    }

    try {
      setLoading(true);

      // ✅ Send all required fields
      await makeAppointment({
        ticket_id: ticketId,
        appointment: formData.datetime,
      });

      if (onSuccess) onSuccess();
      setFormData({ datetime: "" });
    } catch (err) {
      // handle validation errors from backend
      const backendError = err?.ticket_id || err?.leader_id || err?.appointment;
      setError(backendError || err.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="appointment-form">
        <label htmlFor="datetime">Select Date & Time</label>
        <input
          type="datetime-local"
          name="datetime"
          id="datetime"
          value={formData.datetime}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
