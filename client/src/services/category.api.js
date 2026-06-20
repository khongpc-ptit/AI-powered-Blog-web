const API_BASE_URL = "http://localhost:3000/api";

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

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

export const categoryApi = {
  // 1) Lấy tất cả danh mục
  // GET /api/admin/categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // 2) Tạo danh mục mới
  // POST /api/admin/categories
  createCategory: async ({ name, description }) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name,
        description,
      }),
    });

    return handleResponse(response);
  },

  // 3) Cập nhật danh mục
  // PATCH /api/admin/categories/:id
  updateCategory: async (id, { name, description }) => {
    const body = {};

    if (name !== undefined) {
      body.name = name;
    }

    if (description !== undefined) {
      body.description = description;
    }

    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  // 4) Xóa danh mục
  // DELETE /api/admin/categories/:id
  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};
