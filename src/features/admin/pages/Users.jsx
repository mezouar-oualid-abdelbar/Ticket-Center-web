// src/features/admin/pages/Users.jsx

import { useState, useEffect, useMemo } from "react";
import Navbar from "../../../components/layout/Navbar";
import { http } from "../../../services/api/http";

/* ── Role colours ────────────────────────────────────────────── */
const ROLE_COLORS = {
  admin: { bg: "#7c3aed", label: "Admin" },
  manager: { bg: "#0d6efd", label: "Manager" },
  technician: { bg: "#fd7e14", label: "Technician" },
  employee: { bg: "#6c757d", label: "Employee" },
  default: { bg: "#343a40", label: "Default" },
};

function RoleBadge({ role }) {
  const cfg = ROLE_COLORS[role] || ROLE_COLORS.default;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: "0.72rem",
        fontWeight: 700,
        background: cfg.bg,
        color: "#fff",
      }}
    >
      {cfg.label}
    </span>
  );
}

/* ── Inline role selector ────────────────────────────────────── */
function RoleSelect({ userId, currentRole, roles, onChanged }) {
  const [value, setValue] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const newRole = e.target.value;
    if (newRole === value) return;
    setSaving(true);
    setError("");
    try {
      const res = await http.patch(`admin/users/${userId}/role`, {
        role: newRole,
      });
      setValue(newRole);
      onChanged(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        style={{
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid var(--card-border)",
          background: "var(--bg)",
          color: "var(--fg)",
          fontSize: "0.83rem",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {/* If user has no role, show a disabled "Default" placeholder first */}
        {value === "default" && (
          <option value="default" disabled>
            Default
          </option>
        )}
        {roles.map((r) => (
          <option key={r} value={r}>
            {ROLE_COLORS[r]?.label ?? r}
          </option>
        ))}
      </select>
      {saving && (
        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          Saving…
        </span>
      )}
      {error && (
        <span style={{ fontSize: "0.75rem", color: "var(--danger)" }}>
          {error}
        </span>
      )}
    </div>
  );
}

/* ── Delete confirm modal ────────────────────────────────────── */
function DeleteModal({ user, onConfirm, onClose, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius)",
          width: "100%",
          maxWidth: 380,
          padding: 28,
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ margin: "0 0 10px", color: "var(--danger)" }}>
          Delete User
        </h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.92rem",
            marginBottom: 20,
          }}
        >
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--fg)" }}>{user.name}</strong>? This
          cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1px solid var(--card-border)",
              background: "var(--glass)",
              color: "var(--fg)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: "var(--danger)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([http.get("admin/users"), http.get("admin/roles")])
      .then(([u, r]) => {
        // normalise: if role is "none" or missing, show as "default"
        const normalised = u.data.map((usr) => ({
          ...usr,
          role: usr.role && usr.role !== "none" ? usr.role : "default",
        }));
        setUsers(normalised);
        setRoles(r.data);
      })
      .catch(() =>
        setError("Failed to load users. Make sure you have the admin role."),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole = filterRole === "all" || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  const stats = useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const onRoleChanged = (updated) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== updated.id) return u;
        return {
          ...updated,
          role:
            updated.role && updated.role !== "none" ? updated.role : "default",
        };
      }),
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await http.delete(`admin/users/${deleteTarget.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  // All selectable roles + "default" for unassigned users
  const allFilterRoles = ["default", ...roles];

  return (
    <>
      <Navbar />
      <div className="route-container">
        {/* Header — no "New User" button */}
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>
            User Management
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              color: "var(--muted)",
              fontSize: "0.88rem",
            }}
          >
            {users.length} total user{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats row */}
        {users.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(ROLE_COLORS).map(([role, cfg]) => {
              const count = stats[role] || 0;
              if (!count) return null;
              return (
                <div
                  key={role}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "var(--radius)",
                    padding: "12px 20px",
                    minWidth: 100,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setFilterRole(filterRole === role ? "all" : role)
                  }
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: cfg.bg,
                    }}
                  >
                    {count}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {cfg.label}
                    {count !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid var(--card-border)",
              background: "var(--bg)",
              color: "var(--fg)",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid var(--card-border)",
              background: "var(--bg)",
              color: "var(--fg)",
              fontSize: "0.9rem",
            }}
          >
            <option value="all">All roles</option>
            {allFilterRoles.map((r) => (
              <option key={r} value={r}>
                {ROLE_COLORS[r]?.label ?? r}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              color: "var(--danger)",
              background: "color-mix(in srgb, var(--danger) 10%, transparent)",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p
            style={{ color: "var(--muted)", textAlign: "center", padding: 32 }}
          >
            Loading users…
          </p>
        )}

        {/* Table */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <p
                style={{
                  color: "var(--muted)",
                  textAlign: "center",
                  padding: 32,
                }}
              >
                No users match your filters.
              </p>
            ) : (
              <>
                {/* Desktop */}
                <div style={{ overflowX: "auto" }} className="desktop-table">
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "var(--glass)" }}>
                        {[
                          "#",
                          "Name",
                          "Email",
                          "Role",
                          "Verified",
                          "Joined",
                          "",
                        ].map((h, i) => (
                          <th
                            key={i}
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              color: "var(--muted)",
                              borderBottom: "1px solid var(--card-border)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user) => (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom: "1px solid var(--card-border)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--glass)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              fontSize: "0.8rem",
                              color: "var(--muted)",
                            }}
                          >
                            #{user.id}
                          </td>
                          <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: "50%",
                                  background: "var(--accent)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  fontSize: "0.85rem",
                                  flexShrink: 0,
                                }}
                              >
                                {user.name[0].toUpperCase()}
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              color: "var(--muted)",
                              fontSize: "0.88rem",
                            }}
                          >
                            {user.email}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <RoleSelect
                              userId={user.id}
                              currentRole={user.role}
                              roles={
                                roles.length
                                  ? roles
                                  : Object.keys(ROLE_COLORS).filter(
                                      (r) => r !== "default",
                                    )
                              }
                              onChanged={onRoleChanged}
                            />
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                color: user.verified ? "#198754" : "#fd7e14",
                              }}
                            >
                              {user.verified ? "✓ Verified" : "⚠ Pending"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              fontSize: "0.82rem",
                              color: "var(--muted)",
                            }}
                          >
                            {user.created_at}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <button
                              onClick={() => setDeleteTarget(user)}
                              style={{
                                background:
                                  "color-mix(in srgb, var(--danger) 12%, transparent)",
                                border:
                                  "1px solid color-mix(in srgb, var(--danger) 30%, transparent)",
                                borderRadius: 8,
                                padding: "5px 12px",
                                color: "var(--danger)",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="mobile-cards">
                  {filtered.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "var(--radius)",
                        padding: "16px",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{user.name}</div>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--muted)",
                              }}
                            >
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            padding: 4,
                          }}
                        >
                          🗑
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <RoleSelect
                          userId={user.id}
                          currentRole={user.role}
                          roles={
                            roles.length
                              ? roles
                              : Object.keys(ROLE_COLORS).filter(
                                  (r) => r !== "default",
                                )
                          }
                          onChanged={onRoleChanged}
                        />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: user.verified ? "#198754" : "#fd7e14",
                            fontWeight: 600,
                          }}
                        >
                          {user.verified ? "✓ Verified" : "⚠ Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.82rem",
                    textAlign: "right",
                  }}
                >
                  Showing {filtered.length} of {users.length} users
                </p>
              </>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <style>{`
        @media (min-width: 769px) { .mobile-cards  { display: none; } }
        @media (max-width: 768px) { .desktop-table { display: none; } }
      `}</style>
    </>
  );
}
