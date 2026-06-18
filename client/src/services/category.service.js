import api from "./api";

export const categoryService = {
  async getAll() {
    const response = await api.get("/blogs/categories");
    return response.data;
  },

  async create(data) {
    const response = await api.post("/admin/categories", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/admin/categories/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
