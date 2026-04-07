import { useState, useMemo } from "react";
import { inputStyle, dropdownStyle, dropdownItem } from "../styles";
export default function TechniciansSelect({
  technicians,
  leader,
  selectedTechs,
  setSelectedTechs,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return [];

    return technicians.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) &&
        t.id !== leader?.id &&
        !selectedTechs.find((u) => u.id === t.id),
    );
  }, [search, technicians, leader, selectedTechs]);

  const addTechnician = (tech) => {
    setSelectedTechs((prev) => [...prev, tech]);
    setSearch("");
  };

  return (
    <>
      <h3 style={{ marginTop: 30 }}>Assign Technicians</h3>

      <div style={{ position: "relative" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technicians..."
          style={inputStyle}
        />

        {filtered.length > 0 && (
          <div style={dropdownStyle}>
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => addTechnician(t)}
                style={dropdownItem}
              >
                {t.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
