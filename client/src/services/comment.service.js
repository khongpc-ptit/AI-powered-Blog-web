import api from "./api";

export const commentService = {
  async getAll(params = {}) {
    const response = await api.get("/admin/comments", { params });
    return response.data;
  },

  async approve(id) {
    const response = await api.patch(`/admin/comments/${id}/approve`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  },
};

export default commentService;
