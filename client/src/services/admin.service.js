import api from "./api";

export const dashboardService = {
  async getStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
};

export const adminUserService = {
  async getAll(params = {}) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export const staffService = {
  async getAll(params = {}) {
    const response = await api.get("/admin/staffs", { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post("/admin/staffs", data);
    return response.data;
  },

  async resetPassword(id, newPassword) {
    const response = await api.patch(`/admin/staffs/${id}/password`, { newPassword });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/staffs/${id}`);
    return response.data;
  },
};

export const permissionService = {
  async getAll() {
    const response = await api.get("/admin/permissions");
    return response.data;
  },

  async getRoles() {
    const response = await api.get("/admin/roles");
    return response.data;
  },

  async createRole(data) {
    const response = await api.post("/admin/roles", data);
    return response.data;
  },

  async updateRolePermissions(id, permissions) {
    const response = await api.patch(`/admin/roles/${id}/permissions`, { permissions });
    return response.data;
  },
};

export default {
  dashboardService,
  adminUserService,
  staffService,
  permissionService,
};
