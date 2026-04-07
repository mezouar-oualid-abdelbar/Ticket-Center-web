export default function TicketPagination({
  page,
  totalPages,
  total,
  onChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "16px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={btn(page === 1)}
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={btn(false, p === page)}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={btn(page === totalPages)}
      >
        Next →
      </button>

      <span
        style={{ color: "var(--fg)", fontSize: "0.85rem", marginLeft: "8px" }}
      >
        {total} ticket{total !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

function btn(disabled, active = false) {
  return {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid var(--card-border)",
    background: active ? "var(--accent)" : "var(--bg-secondary)",
    color: active ? "#fff" : disabled ? "var(--fg-muted, #999)" : "var(--fg)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: active ? "600" : "400",
    opacity: disabled ? 0.5 : 1,
    fontSize: "0.85rem",
    transition: "0.2s",
  };
}
