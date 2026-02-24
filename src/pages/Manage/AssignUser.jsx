import { useState, useMemo } from "react";
import { usersApi } from "../../api/userApi";

export default function AssignUserPalette() {
  const allUsers = usersApi.getUser();

  const [leaderSearch, setLeaderSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [leader, setLeader] = useState(null);
  const [users, setUsers] = useState([]);

  /* =============================
     FILTERED LISTS
  ============================== */

  const filteredLeaders = useMemo(() => {
    if (!leaderSearch.trim()) return [];
    return allUsers.filter((u) =>
      u.name.toLowerCase().includes(leaderSearch.toLowerCase()),
    );
  }, [leaderSearch, allUsers]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return [];

    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
        u.id !== leader?.id && // 🚫 exclude leader
        !users.find((usr) => usr.id === u.id), // 🚫 exclude already selected
    );
  }, [userSearch, allUsers, leader, users]);

  /* =============================
     ACTIONS
  ============================== */

  const selectLeader = (user) => {
    setLeader(user);

    // Remove from users if already selected
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

    setLeaderSearch("");
  };

  const addUser = (user) => {
    setUsers([...users, user]);
    setUserSearch("");
  };

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  /* =============================
     UI
  ============================== */

  return (
    <div style={{ maxWidth: 420 }}>
      {/* ================= LEADER ================= */}
      <h3>Assign Leader</h3>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search leader..."
          value={leaderSearch}
          onChange={(e) => setLeaderSearch(e.target.value)}
          style={inputStyle}
        />

        {filteredLeaders.length > 0 && (
          <div style={dropdownStyle}>
            {filteredLeaders.map((user) => (
              <div
                key={user.id}
                onClick={() => selectLeader(user)}
                style={dropdownItem}
              >
                {user.name}
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

      {/* ================= USERS ================= */}
      <h3 style={{ marginTop: 30 }}>Assign Users</h3>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={inputStyle}
        />

        {filteredUsers.length > 0 && (
          <div style={dropdownStyle}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => addUser(user)}
                style={dropdownItem}
              >
                {user.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {users.length > 0 && (
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}
        >
          {users.map((user) => (
            <div key={user.id} style={tagStyle}>
              {user.name}
              <button onClick={() => removeUser(user.id)} style={removeBtn}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =============================
   STYLES (clean & consistent)
============================== */

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius)",
  border: "1px solid var(--card-border)",
  background: "var(--bg)",
  color: "var(--fg)",
  outline: "none",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow)",
  marginTop: 4,
  maxHeight: 200,
  overflowY: "auto",
  zIndex: 10,
};

const dropdownItem = {
  padding: "8px 12px",
  cursor: "pointer",
};

const tagStyle = {
  padding: "6px 12px",
  borderRadius: "var(--radius)",
  background: "var(--accent)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 600,
  boxShadow: "var(--shadow)",
};

const singleTag = {
  marginTop: 10,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  borderRadius: "var(--radius)",
  background: "var(--success)",
  fontWeight: 600,
};

const removeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};
