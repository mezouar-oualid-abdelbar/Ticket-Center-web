const STATUSES = [
  "all",
  "open",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
];

export default function TicketFilters({ status, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: "1px solid var(--card-border)",
            background: status === s ? "var(--accent)" : "var(--bg-secondary)",
            color: status === s ? "#fff" : "var(--fg)",
            fontWeight: status === s ? "600" : "400",
            cursor: "pointer",
            fontSize: "0.85rem",
            textTransform: "capitalize",
            transition: "0.2s",
          }}
        >
          {s.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
