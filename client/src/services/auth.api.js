const API_BASE_URL = "/api";

const getHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    if (data.errors) {
      const fieldErrors = {};
      Object.keys(data.errors).forEach((field) => {
        fieldErrors[field] = {
          msg: data.errors[field].msg || data.errors[field],
        };
      });
      throw {
        message: data.message || "Validation error",
        status: response.status,
        errors: fieldErrors,
      };
    }
    throw {
      message: data.message || "An error occurred",
      status: response.status,
    };
  }

  return data;
};

export const authApi = {
  register: async ({
    name,
    email,
    password,
    confirm_password,
    date_of_birth,
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        confirm_password,
        date_of_birth,
      }),
    });
    return handleResponse(response);
  },

  login: async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  logout: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return handleResponse(response);
  },

  refreshAccessToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return handleResponse(response);
  },
};

export const userApi = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  changePassword: async ({ password, new_password, confirm_password }) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/password`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ password, new_password, confirm_password }),
    });
    return handleResponse(response);
  },
};

export const saveTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
