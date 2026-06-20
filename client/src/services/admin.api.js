const API_BASE_URL = "/api";

const getAdminHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return {};
  }
  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    console.warn("Invalid token format detected, clearing tokens");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      if (data.message?.includes("malformed")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/admin/login";
        throw {
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
          status: 401,
          isAuthError: true,
        };
      }
    }
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

export const adminApi = {
  // ========== 1. Dashboard ==========

  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  // ========== 2. Blogs ==========

  getBlogs: async ({ page = 1, limit = 10, search = "" } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await fetch(`${API_BASE_URL}/admin/blogs?${params.toString()}`, {
      method: "GET",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  getBlogById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      method: "GET",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  createBlog: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  updateBlog: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      method: "PATCH",
      headers: getAdminHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  toggleBlogPublish: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}/status`, {
      method: "PATCH",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  generateBlogContent: async (prompt) => {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders(),
      },
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
  },

  // ========== 3. Categories ==========

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "GET",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  createCategory: async ({ name, description }) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders(),
      },
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(response);
  },

  updateCategory: async (id, { name, description }) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders(),
      },
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(response);
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  // ========== 4. Comments ==========

  getComments: async ({ page = 1, limit = 10, search = "", is_approved = "" } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (is_approved) params.append("is_approved", is_approved);

    const response = await fetch(`${API_BASE_URL}/admin/comments?${params.toString()}`, {
      method: "GET",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  approveComment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/comments/${id}/approve`, {
      method: "PATCH",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },

  deleteComment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    return handleResponse(response);
  },
};
