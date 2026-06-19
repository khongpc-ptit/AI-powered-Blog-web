import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { userApi } from "../../services/user.api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total_pages: 1,
    total_items: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    location: "",
    role_id: "",
  });

  const clearNotify = () => {
    setMessage("");
    setError("");
  };

  const getErrorMessage = (err) => {
    if (err?.status === 409) {
      return "Email đã tồn tại";
    }

    if (err?.status === 404) {
      return err.message || "Không tìm thấy user hoặc role";
    }

    if (err?.errors) {
      const firstError = Object.values(err.errors)[0];
      return firstError?.msg || err.message || "Dữ liệu không hợp lệ";
    }

    return err?.message || "Có lỗi xảy ra";
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      clearNotify();

      const data = await userApi.getUsers({
        page: 1,
        limit: 100,
        search: "",
      });

      setUsers(data.result || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  const formatDateForTable = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN");
  };

  const getRoleText = (role) => {
    if (!role) return "N/A";

    if (typeof role === "object") {
      return role.name || role._id || "N/A";
    }

    return role;
  };

  const handleEdit = (user) => {
    clearNotify();

    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      date_of_birth: formatDateForInput(user.date_of_birth),
      location: user.location || "",
      role_id:
        typeof user.role_id === "object"
          ? user.role_id?._id || ""
          : user.role_id || "",
    });

    setShowModal(true);
  };

  const handleDeleteClick = (user) => {
    clearNotify();
    setDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      clearNotify();

      const data = await userApi.deleteUser(deleteConfirm._id);

      setDeleteConfirm(null);
      await fetchUsers();

      setMessage(
        `Đã xóa user: ${data.result?.name || deleteConfirm.name || "Unknown"}`,
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearNotify();

    if (!editingUser) return;

    const payload = {};

    if (formData.name.trim()) {
      payload.name = formData.name.trim();
    }

    if (formData.email.trim()) {
      payload.email = formData.email.trim();
    }

    if (formData.date_of_birth) {
      payload.date_of_birth = new Date(formData.date_of_birth).toISOString();
    }

    if (formData.location.trim()) {
      payload.location = formData.location.trim();
    }

    if (formData.role_id.trim()) {
      payload.role_id = formData.role_id.trim();
    }

    try {
      await userApi.updateUser(editingUser._id, payload);

      setShowModal(false);
      setEditingUser(null);

      setFormData({
        name: "",
        email: "",
        date_of_birth: "",
        location: "",
        role_id: "",
      });

      await fetchUsers();

      setMessage("Cập nhật user thành công");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const columns = [
    {
      field: "index",
      header: "#",
      sortable: false,
      headerClassName: "w-12",
      render: (item) => item.index,
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {item.name ? item.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>

          <span className="font-medium text-gray-800">
            {item.name || "No name"}
          </span>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">{item.email || "N/A"}</span>
      ),
    },
    {
      field: "date_of_birth",
      header: "Date of Birth",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">
          {formatDateForTable(item.date_of_birth)}
        </span>
      ),
    },
    {
      field: "location",
      header: "Location",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">{item.location || "N/A"}</span>
      ),
    },
    {
      field: "role_id",
      header: "Role",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
          {getRoleText(item.role_id)}
        </span>
      ),
    },
    {
      field: "created_at",
      header: "Created At",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">
          {formatDateForTable(item.created_at)}
        </span>
      ),
    },
    {
      field: "updated_at",
      header: "Updated At",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">
          {formatDateForTable(item.updated_at)}
        </span>
      ),
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleEdit(item)}
            className="border px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>

          <img
            src={assets.cross_icon}
            onClick={() => handleDeleteClick(item)}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            alt="Delete"
          />
        </div>
      ),
    },
  ];

  const tableData = useMemo(() => {
    return users.map((user, index) => ({
      ...user,
      index: index + 1,
    }));
  }, [users]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-1 bg-blue-50/50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          <p className="text-xs text-gray-400 mt-1">
            Total users: {pagination.total_items || users.length}
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-700 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search users..."
        searchableFields={["name", "email", "location"]}
        defaultSortField="created_at"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage="No users found."
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>

                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role ID
                  </label>

                  <input
                    type="text"
                    value={formData.role_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter role ObjectId"
                  />

                  <p className="text-xs text-gray-400 mt-1">
                    Nhập ObjectId của role. Nếu role không tồn tại, backend sẽ
                    trả lỗi Role not found.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete User
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete user "{deleteConfirm.name}"?
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
