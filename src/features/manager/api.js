// src/features/assignment/api.js

import { http } from "../../services/api/http";

// export async function createTicket(data) {
//   try {
//     const response = await http.post("ticket", data);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       throw error.response.data;
//     } else {
//       throw { message: "Network error" };
//     }
//   }
// }

export async function getTickets() {
  try {
    const response = await http.get("manager/ticket");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function getTicket(id) {
  try {
    const response = await http.get(`manager/ticket/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function getTechnicians() {
  try {
    const response = await http.get(`manager/technicians`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function createAssignment(ticketId, data) {
  try {
    const response = await http.post(`manager/ticket/${ticketId}/assign`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function getTiketProgress(ticketId) {
  try {
    const response = await http.get(`manager/ticket/${ticketId}/progress`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export const updateAssignment = (ticketId, data) =>
  http.put(`manager/assignments/${ticketId}`, data).then((res) => res.data);
