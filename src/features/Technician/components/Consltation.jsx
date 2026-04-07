import { useState } from "react";
import { completeAppointment } from "../api"; // fix path

export default function Consultation({ interventionid, onComplete }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!note.trim()) return;

    setLoading(true);

    try {
      await completeAppointment(interventionid, { note });
      alert("Consultation updated!");
      onComplete?.(interventionid); // trigger appointment form in parent
    } catch (err) {
      console.error(err);
      alert("Error updating consultation");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = () => {
    if (!window.confirm("End this assignment?")) return;
    console.log("End assignment for:", interventionid);
  };

  return (
    <div style={wrapper}>
      <header style={header}>Add Consultation</header>

      <textarea
        placeholder="Write consultation details..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={textarea}
      />

      <div style={actions}>
        <button onClick={handleUpdate} disabled={loading} style={primaryBtn}>
          {loading ? "Updating..." : "Update Consultation"}
        </button>
        <button onClick={handleEnd} style={dangerBtn}>
          End Assignment
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: "var(--radius)",
  padding: "20px",
  boxShadow: "var(--shadow)",
  maxWidth: 500,
};

const header = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 16,
  color: "var(--fg)",
};

const textarea = {
  width: "100%",
  minHeight: 120,
  padding: "12px",
  borderRadius: "var(--radius)",
  border: "1px solid var(--card-border)",
  background: "var(--bg)",
  color: "var(--fg)",
  resize: "vertical",
  outline: "none",
  fontFamily: "inherit",
  marginBottom: 16,
};

const actions = {
  display: "flex",
  gap: 12,
};

const primaryBtn = {
  flex: 1,
  padding: "10px 16px",
  borderRadius: "var(--radius)",
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const dangerBtn = {
  flex: 1,
  padding: "10px 16px",
  borderRadius: "var(--radius)",
  border: "none",
  background: "var(--danger)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
