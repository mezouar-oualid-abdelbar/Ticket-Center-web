import axios from "axios";

export const http = axios.create({
  baseURL: "http://yourserver/api/",
  timeout: 5000,
});
