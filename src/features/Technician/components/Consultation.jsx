import { useState } from "react";
import { completeAppointment } from "../api";
import { useNavigate } from "react-router-dom";

export default function Consultation({ interventionid, onComplete }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!note.trim()) {
      alert("Please write a consultation note.");
      return;
    }
    setLoading(true);
    try {
      await completeAppointment(interventionid, { note });
      alert("Consultation updated!");
      onComplete?.(interventionid);
    } catch (err) {
      console.error(err);
      alert("Error updating consultation");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!window.confirm("End this assignment?")) return;
    if (!note.trim()) {
      alert("Please add a note before ending the assignment.");
      return;
    }
    setEnding(true);
    try {
      await completeAppointment(interventionid, { note, status: "completed" });
      alert("Assignment ended successfully!");
      navigate("/technician/assignments");
    } catch (err) {
      console.error(err);
      alert("Error ending assignment");
    } finally {
      setEnding(false);
    }
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
        <button
          onClick={handleUpdate}
          disabled={loading || ending}
          style={primaryBtn}
        >
          {loading ? "Updating..." : "Update Consultation"}
        </button>
        <button
          onClick={handleEnd}
          disabled={ending || loading}
          style={dangerBtn}
        >
          {ending ? "Ending..." : "End Assignment"}
        </button>
      </div>
    </div>
  );
}

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
