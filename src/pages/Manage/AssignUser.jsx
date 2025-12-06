import { useState } from "react";
import { usersApi } from "../../api/userApi";

export default function AssignUserPalette() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);

  const allUsers = usersApi.getUser();

  const filteredUsers =
    search.trim() === ""
      ? []
      : allUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) &&
            !tags.find((t) => t.id === user.id)
        );

  const addTag = (user) => {
    setTags([...tags, user]);
    setSearch("");
  };

  const removeTag = (user) => {
    setTags(tags.filter((t) => t.id !== user.id));
  };

  return (
    <>
      <h2>Assign Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--card-border)",
          marginBottom: "12px",
          width: "100%",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
      />
      {filteredUsers.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => addTag(user)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--card-border)",
                background: "var(--bg)",
                color: "var(--fg)",
                cursor: "pointer",
                boxShadow: "var(--shadow)",
                fontWeight: 600,
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "var(--accent)")}
              onMouseOut={(e) => (e.target.style.background = "var(--bg)")}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {tags.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius)",
                background: "var(--accent)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
                boxShadow: "var(--shadow)",
              }}
            >
              {user.name}
              <button
                onClick={() => removeTag(user)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
