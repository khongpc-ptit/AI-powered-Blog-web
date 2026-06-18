import api from "./api";

export const userService = {
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch("/users/profile/password", data);
    return response.data;
  },
};

export default userService;
