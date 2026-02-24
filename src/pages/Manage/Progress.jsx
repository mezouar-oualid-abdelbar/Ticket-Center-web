export default function AssignUserPalette() {
  const consultations = [
    {
      id: 1,
      title: "Consultation 1",
      note: "The plug needs changing",
      time: "13/13/2025 13:00",
    },
    {
      id: 2,
      title: "Consultation 2",
      note: "The plug has been changed successfully",
      time: "14/13/2025 15:30",
    },
  ];

  return (
    <div style={wrapper}>
      <p style={appointment}>Appointment set to 13/13/2025 13:00</p>

      {consultations.map((c) => (
        <div key={c.id} style={card}>
          <div style={cardHeader}>
            <span style={cardTitle}>{c.title}</span>
            <span style={cardTime}>{c.time}</span>
          </div>
          <div style={cardBody}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}

/* ================== STYLES ================== */

const wrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxWidth: "500px",
  marginTop: "20px",
  fontFamily: "inherit",
};

const appointment = {
  fontWeight: 600,
  color: "var(--fg)",
};

const card = {
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow)",
  padding: "12px 16px",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "6px",
  alignItems: "center",
};

const cardTitle = {
  fontWeight: 600,
  color: "var(--fg)",
};

const cardTime = {
  fontSize: "12px",
  color: "var(--muted)",
};

const cardBody = {
  fontSize: "14px",
  color: "var(--fg)",
};
