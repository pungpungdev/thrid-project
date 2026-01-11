import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.SERVER_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
