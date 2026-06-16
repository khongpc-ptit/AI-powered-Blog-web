import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-token");
        const token = localStorage.getItem("token");
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// AUTH SERVICE
// ==========================================
export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  refreshToken: () => api.post("/auth/refresh-token"),
  logout: () => api.post("/auth/logout"),
};

// ==========================================
// BLOG SERVICE (Public & User)
// ==========================================
export const blogService = {
  getAll: (params) => api.get("/blogs", { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  getCategories: () => api.get("/blogs/categories"),
  getComments: (blogId) => api.get(`/blogs/${blogId}/comments`),
  addComment: (blogId, data) => api.post(`/blogs/${blogId}/comments`, data),
  getUserProfile: () => api.get("/blogs/profile"),
  updateUserProfile: (data) => api.patch("/blogs/profile", data),
  changeUserPassword: (data) => api.patch("/blogs/profile/password", data),
};

// ==========================================
// ADMIN BLOG SERVICE
// ==========================================
export const adminBlogService = {
  getAll: (params) => api.get("/admin/blogs", { params }),
  create: (formData) =>
    api.post("/admin/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.patch(`/admin/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/admin/blogs/${id}`),
  togglePublish: (id) => api.patch(`/admin/blogs/${id}/status`),
  generateContent: (data) => api.post("/admin/blogs/generate", data),
};

// ==========================================
// ADMIN CATEGORY SERVICE
// ==========================================
export const categoryService = {
  create: (data) => api.post("/admin/categories", data),
  update: (id, data) => api.patch(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// ==========================================
// ADMIN COMMENT SERVICE
// ==========================================
export const commentService = {
  getAll: (params) => api.get("/admin/comments", { params }),
  approve: (id) => api.patch(`/admin/comments/${id}/approve`),
  delete: (id) => api.delete(`/admin/comments/${id}`),
};

// ==========================================
// ADMIN USER SERVICE
// ==========================================
export const userService = {
  getAll: (params) => api.get("/admin/users", { params }),
  update: (id, data) => api.patch(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

// ==========================================
// ADMIN STAFF SERVICE
// ==========================================
export const staffService = {
  getAll: (params) => api.get("/admin/staffs", { params }),
  create: (data) => api.post("/admin/staffs", data),
  resetPassword: (id, data) => api.patch(`/admin/staffs/${id}/password`, data),
  delete: (id) => api.delete(`/admin/staffs/${id}`),
};

// ==========================================
// ADMIN ROLE & PERMISSION SERVICE
// ==========================================
export const roleService = {
  getPermissions: () => api.get("/admin/permissions"),
  getAll: () => api.get("/admin/roles"),
  create: (data) => api.post("/admin/roles", data),
  updatePermissions: (id, permissions) =>
    api.patch(`/admin/roles/${id}/permissions`, { permissions }),
};

// ==========================================
// ADMIN DASHBOARD SERVICE
// ==========================================
export const dashboardService = {
  get: () => api.get("/admin/dashboard"),
};

export default api;
