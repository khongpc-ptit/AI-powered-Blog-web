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
  const accessToken = localStorage.getItem("accessToken");

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

export const roleApi = {
  // 1) Lấy danh sách tất cả quyền
  // GET /api/admin/permissions
  getPermissions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/permissions`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // 2) Lấy danh sách tất cả role
  // GET /api/admin/roles
  getRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/roles`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // 3) Tạo role mới
  // POST /api/admin/roles
  createRole: async ({ name, description = "", permissions = [] }) => {
    const response = await fetch(`${API_BASE_URL}/admin/roles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name,
        description,
        permissions,
      }),
    });

    return handleResponse(response);
  },

  // 4) Cập nhật quyền cho role
  // PATCH /api/admin/roles/:id/permissions
  updateRolePermissions: async (id, permissions = []) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/roles/${id}/permissions`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          permissions,
        }),
      },
    );

    return handleResponse(response);
  },

  // 5) Xóa role
  // DELETE /api/admin/roles/:id
  // Lưu ý: backend phải có route này thì mới chạy được
  deleteRole: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/roles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};
