import api from "../api/axios";

export const login = (data) =>
  api.post("/api/admin/login", data, { withCredentials: true });

export const logout = () =>
  api.post("/api/admin/logout", {}, { withCredentials: true });

export const getProfile = () =>
  api.get("/api/admin/profile", { withCredentials: true });

export const updatePassword = (data) => api.patch('/api/admin/updatePassword', data);