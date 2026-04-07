import { tagStyle, removeBtn } from "../styles";

export default function SelectedTechnicians({ technicians, removeTechnician }) {
  if (!technicians.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      {technicians.map((t) => (
        <div key={t.id} style={tagStyle}>
          {t.name}
          <button onClick={() => removeTechnician(t.id)} style={removeBtn}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
