// src/features/ticket/pages/CreateTicket.jsx

import { useRef, useEffect } from "react";
import Navbar from "../../../components/layout/Navbar";
import { useCreateTicket } from "../hooks/UseCreateTicket";

export default function CreateTicket() {
  const textareaRef = useRef(null);
  const {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useCreateTicket();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [formData.description]);

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1
          style={{
            color: "var(--fg)",
            marginBottom: "20px",
            fontSize: "1.8rem",
            letterSpacing: "0.5px",
            fontWeight: "600",
          }}
        >
          Create Ticket
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "600px",
          }}
        >
          {/* Server error */}
          {serverError && (
            <p style={{ color: "#e02424", fontSize: "0.875rem" }}>
              {serverError}
            </p>
          )}

          {/* Description */}
          <div>
            <textarea
              ref={textareaRef}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your problem..."
              disabled={isLoading}
              style={{
                padding: "12px 15px",
                borderRadius: "10px",
                border: errors.description
                  ? "1px solid #e02424"
                  : "1px solid var(--card-border)",
                background: "var(--bg-secondary)",
                color: "var(--fg)",
                width: "100%",
                fontSize: "1rem",
                resize: "none",
                overflow: "hidden",
                outline: "none",
                transition: "0.2s",
              }}
            />
            {errors.description && (
              <p
                style={{
                  color: "#e02424",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                }}
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "12px 15px",
              borderRadius: "10px",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              transition: "0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}
