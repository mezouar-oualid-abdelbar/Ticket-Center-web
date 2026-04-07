import { http } from "../../services/api/http";

export async function getAssigments() {
  try {
    const response = await http.get(`technician/assigments`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}
export async function getAssigment(id) {
  try {
    const response = await http.get(`technician/assigment/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function makeAppointment(data) {
  try {
    const response = await http.post("technician/appointment", data);
    return response.data;
  } catch (err) {
    console.error("Error making appointment:", err);
    throw err.response?.data || err;
  }
}

export async function completeAppointment(interventionId, data) {
  try {
    const response = await http.post(
      `technician/${interventionId}/intervention/`, // ← use backticks
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error completing consultation:", err);
    throw err.response?.data || err;
  }
}
// export async function declineAssignment(id, data) {
//   return http.post(`technician/assigment/${id}/decline`, data);
// }
