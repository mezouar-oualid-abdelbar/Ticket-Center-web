import { useState } from "react";

export default function Consultation({ id }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    if (!note.trim()) return;

    setLoading(true);

    // TODO: connect to API
    console.log("Update assignment for:", id, "Note:", note);

    setTimeout(() => {
      setLoading(false);
      alert("Assignment updated");
    }, 800);
  };

  const handleEnd = () => {
    if (!window.confirm("Are you sure you want to end this assignment?"))
      return;

    console.log("End assignment for:", id);
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
          {loading ? "Updating..." : "Update Assignment"}
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
