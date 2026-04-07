import { useState, useMemo } from "react";
import {
  removeBtn,
  singleTag,
  inputStyle,
  dropdownStyle,
  dropdownItem,
} from "../styles";

export default function LeaderSelect({
  technicians,
  leader,
  setLeader,
  removeTechnicianFromList,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    return technicians.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, technicians]);

  const selectLeader = (tech) => {
    setLeader(tech);
    removeTechnicianFromList(tech.id);
    setSearch("");
  };

  return (
    <>
      <h3>Assign Leader</h3>

      <div style={{ position: "relative" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leader..."
          style={inputStyle}
        />

        {filtered.length > 0 && (
          <div style={dropdownStyle}>
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => selectLeader(t)}
                style={dropdownItem}
              >
                {t.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {leader && (
        <div style={singleTag}>
          {leader.name}
          <button onClick={() => setLeader(null)} style={removeBtn}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}
