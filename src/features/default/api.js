// src/features/assignment/api.js

import { http } from "../../services/api/http";

export async function createTicket(data) {
  try {
    const response = await http.post("ticket", data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function getTickets() {
  try {
    const response = await http.get("ticket");
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
    const response = await http.get(`ticket/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function updateTicket(id, data) {
  try {
    const response = await http.put(`ticket/${id}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}

export async function deleteTicket(id) {
  try {
    const response = await http.delete(`ticket/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
}
