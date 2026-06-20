const API_BASE_URL = "http://localhost:3000/api";

// Shared AbortController for blog requests
let currentController = null;

const cancelPreviousRequest = () => {
  if (currentController) {
    currentController.abort();
  }
  currentController = new AbortController();
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

export const blogApi = {
  // 1) Lấy danh sách chuyên mục (Categories)
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/blogs/categories`);
    return handleResponse(response);
  },

  // 2) Lấy danh sách bài viết (Blogs) với pagination, search, filter, sort
  getBlogs: async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
    sort_by = "created_at",
    order = "desc",
  } = {}) => {
    cancelPreviousRequest();
    
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (sort_by) params.append("sort_by", sort_by);
    if (order) params.append("order", order);

    const response = await fetch(`${API_BASE_URL}/blogs?${params.toString()}`, {
      signal: currentController.signal,
    });
    return handleResponse(response);
  },

  // 3) Lấy chi tiết bài viết
  getBlogById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    return handleResponse(response);
  },

  // 4) Lấy bình luận của bài viết
  getComments: async (blogId, { page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    const response = await fetch(
      `${API_BASE_URL}/blogs/${blogId}/comments?${params.toString()}`,
    );
    return handleResponse(response);
  },

  // 5) Thêm bình luận vào bài viết (Yêu cầu đăng nhập)
  addComment: async (blogId, content) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },
};
