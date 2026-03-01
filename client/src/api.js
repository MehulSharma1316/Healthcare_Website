import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token for admin routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTests = (params = {}) => api.get("/public/tests", { params }).then((r) => r.data);
export const fetchPackages = () => api.get("/public/packages").then((r) => r.data);
export const fetchPopularPackages = () => api.get("/public/packages/popular").then((r) => r.data);
export const fetchPosters = () => api.get("/public/posters").then((r) => r.data);
export const createBooking = (payload) => api.post("/public/booking", payload).then((r) => r.data);

export const adminLogin = (payload) => api.post("/admin/login", payload).then((r) => r.data);
export const adminTests = {
  list: () => api.get("/admin/tests").then((r) => r.data),
  create: (payload) => api.post("/admin/tests", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/admin/tests/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/admin/tests/${id}`),
};
export const adminPackages = {
  list: () => api.get("/admin/packages").then((r) => r.data),
  create: (payload) => api.post("/admin/packages", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/admin/packages/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/admin/packages/${id}`),
};
export const adminBookings = {
  list: () => api.get("/admin/bookings").then((r) => r.data),
};
export const adminPosters = {
  list: () => api.get("/admin/posters").then((r) => r.data),
  create: (payload) => api.post("/admin/posters", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/admin/posters/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/admin/posters/${id}`),
};

export const adminUpload = (formData) => api.post("/admin/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export default api;
