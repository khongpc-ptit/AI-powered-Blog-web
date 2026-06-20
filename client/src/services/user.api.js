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

export const userApi = {
  getUsers: async ({ page = 1, limit = 10, search = "" } = {}) => {
    const accessToken = localStorage.getItem("accessToken");

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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return handleResponse(response);
  },

  updateUser: async (id, { name, email, date_of_birth, location, role_id }) => {
    const accessToken = localStorage.getItem("accessToken");

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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return handleResponse(response);
  },
};
