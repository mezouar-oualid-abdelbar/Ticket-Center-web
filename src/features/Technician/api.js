// assignments.js (API service) — fix all typos
import { http } from "../../services/api/http";

export async function getAssigments() {
  try {
    const response = await http.get("technician/assignments");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
}

export async function getAssigment(id) {
  try {
    const response = await http.get(`technician/assignment/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
}

export async function makeAppointment(data) {
  try {
    const response = await http.post("technician/appointment", data);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function updateAppointment(interventionId, data) {
  try {
    const response = await http.post(
      `technician/${interventionId}/intervention/update`,
      data,
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function completeAppointment(interventionId, data) {
  try {
    const response = await http.post(
      `technician/${interventionId}/intervention/complete`,
      data,
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
