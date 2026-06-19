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

export const staffApi = {
  // 1) Lấy danh sách nhân sự / admin
  // GET /api/admin/staffs?page=1&limit=10&search=
  getStaffs: async ({ page = 1, limit = 10, search = "" } = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/staffs?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return handleResponse(response);
  },

  // 2) Tạo tài khoản quản trị viên / nhân sự mới
  // POST /api/admin/staffs
  createStaff: async ({
    name,
    email,
    password,
    confirm_password,
    date_of_birth,
    role_id,
    location,
  }) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}/admin/staffs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirm_password,
        date_of_birth,
        role_id,
        location,
      }),
    });

    return handleResponse(response);
  },

  // 3) Đặt lại mật khẩu nhân sự
  // PATCH /api/admin/staffs/:id/password
  resetStaffPassword: async (id, new_password) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE_URL}/admin/staffs/${id}/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          new_password,
        }),
      },
    );

    return handleResponse(response);
  },

  // 4) Xóa tài khoản nhân sự
  // DELETE /api/admin/staffs/:id
  deleteStaff: async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}/admin/staffs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return handleResponse(response);
  },
};
