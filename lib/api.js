import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-8f1h.onrender.com/api",
  adapter: "xhr", // IMPORTANT FIX FOR EXPO WEB
});

export default api;