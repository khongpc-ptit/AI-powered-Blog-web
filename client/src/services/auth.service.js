import api from "./api";

export const authService = {
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },
};

export default authService;
