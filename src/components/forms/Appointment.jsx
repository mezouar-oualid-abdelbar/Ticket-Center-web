import { assigmentApi } from "../../api/assigment";
import React, { useState } from "react";

export default function Appointment({ id }) {
  const [formData, setFormData] = useState({
    datetime: "",
    reason: "",
  });

  const handleDecline = (e) => {
    e.preventDefault();
    console.log(`decline ${id} reason: ${formData.reason}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`submit ${id} ${formData.datetime}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
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

          <button type="submit" className="btn-submit">
            Submit
          </button>
        </form>
      </div>

      {/* <div className="form-card">
        <form onSubmit={handleDecline} className="appointment-form">
          <label htmlFor="reason">Type the reason</label>

          <input
            type="text"
            name="reason"
            id="reason"
            value={formData.reason}
            onChange={handleChange}
            className="input"
          />

          <button type="submit" className="btn-danger">
            Decline
          </button>
        </form>
      </div> */}
    </>
  );
}
