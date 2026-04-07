import { http } from "../../services/api/http";

export async function login(data) {
  try {
    const response = await http.post("login", data);

    console.log("Login successful:", response.data);

    // Store token
    if (response.data.tokken) {
      localStorage.setItem("token", response.data.tokken);
    }

    // Store permissions
    if (response.data.permissions) {
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions),
      );
    }
    // Store roles
    if (response.data.roles) {
      localStorage.setItem("roles", JSON.stringify(response.data.roles));
    }

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

    console.log("logout successful:", response.data);

    // Remove local storage here
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");

    return response.data;
  } catch (error) {
    // Still remove them even if logout API fails
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");

    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}
