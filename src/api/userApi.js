import { http } from "./http";

export function login(data) {
  return http.post("login.php", data);
}

export function getUsers() {
  return http.get("users.php");
}
