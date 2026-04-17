import { http } from "../../services/api/http";
import { refreshEchoAuth } from "../../services/socket/echo";

export async function login(data) {
  try {
    const response = await http.post("login", data);

    // Store token
    if (response.data.tokken) {
      localStorage.setItem("token", response.data.tokken);
    }
    if (response.data.permissions) {
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions),
      );
    }
    if (response.data.roles) {
      localStorage.setItem("roles", JSON.stringify(response.data.roles));
    }

    // ── Inject fresh token into Echo so private channels work immediately ──
    refreshEchoAuth();

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function logout() {
  try {
    const response = await http.post("logout");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("roles");
  }
}
