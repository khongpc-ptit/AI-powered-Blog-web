const API_BASE_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

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

const getAuthHeaders = () => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("ptitblog_admin_token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (
    accessToken &&
    accessToken !== "null" &&
    accessToken !== "undefined" &&
    accessToken.split(".").length === 3
  ) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

export const userApi = {
  // 1) Lấy danh sách tất cả User
  // GET /api/admin/users?page=1&limit=10&search=
  getUsers: async ({ page = 1, limit = 10, search = "" } = {}) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/users?${params.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    return handleResponse(response);
  },

  // 2) Cập nhật thông tin User
  // PATCH /api/admin/users/:id
  updateUser: async (id, { name, email, date_of_birth, location, role_id }) => {
    const body = {};

    if (name !== undefined) {
      body.name = name;
    }

    if (email !== undefined) {
      body.email = email;
    }

    if (date_of_birth !== undefined) {
      body.date_of_birth = date_of_birth;
    }

    if (location !== undefined) {
      body.location = location;
    }

    if (role_id !== undefined) {
      body.role_id = role_id;
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  // 3) Xóa User
  // DELETE /api/admin/users/:id
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};
