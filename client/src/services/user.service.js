import api from "./api";

export const userService = {
  async getProfile() {
    const response = await api.get("/blogs/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch("/blogs/profile", data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch("/blogs/profile/password", data);
    return response.data;
  },
};

export default userService;
