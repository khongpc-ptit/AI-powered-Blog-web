import api from "./api";

export const blogService = {
  async getAll(params = {}) {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get("/blogs/categories");
    return response.data;
  },

  async getComments(blogId, params = {}) {
    const response = await api.get(`/blogs/${blogId}/comments`, { params });
    return response.data;
  },

  async addComment(blogId, content) {
    const response = await api.post(`/blogs/${blogId}/comments`, { content });
    return response.data;
  },
};

export const adminBlogService = {
  async getAll(params = {}) {
    const response = await api.get("/admin/blogs", { params });
    return response.data;
  },

  async create(formData) {
    const response = await api.post("/admin/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async update(id, formData) {
    const response = await api.patch(`/admin/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.patch(`/admin/blogs/${id}/status`);
    return response.data;
  },

  async generateContent(prompt) {
    const response = await api.post("/admin/blogs/generate", { prompt });
    return response.data;
  },
};

export default blogService;
