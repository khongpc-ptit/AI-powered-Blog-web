import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";

// Mock roles data - sau này thay bằng API
const mockRoles = [
  { _id: "1", name: "Super Admin" },
  { _id: "2", name: "Admin" },
  { _id: "3", name: "Blogger" },
  { _id: "4", name: "User" },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    role_id: "",
    verified: "Unverified",
    location: "",
    avatar: "",
  });

  // Mock users data
  const mockUsers = [
    {
      _id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      date_of_birth: "1995-05-15",
      role_id: "1",
      verified: "Verified",
      location: "Hà Nội",
      avatar: "",
      created_at: "2025-01-10T08:00:00.000Z",
      updated_at: "2025-06-01T10:30:00.000Z",
    },
    {
      _id: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      date_of_birth: "1998-08-22",
      role_id: "3",
      verified: "Verified",
      location: "TP. Hồ Chí Minh",
      avatar: "",
      created_at: "2025-02-15T09:00:00.000Z",
      updated_at: "2025-05-20T14:00:00.000Z",
    },
    {
      _id: "3",
      name: "Lê Văn C",
      email: "levanc@example.com",
      date_of_birth: "2000-03-10",
      role_id: "4",
      verified: "Unverified",
      location: "Đà Nẵng",
      avatar: "",
      created_at: "2025-03-01T10:00:00.000Z",
      updated_at: "2025-03-01T10:00:00.000Z",
    },
    {
      _id: "4",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      date_of_birth: "1992-11-30",
      role_id: "2",
      verified: "Verified",
      location: "Hải Phòng",
      avatar: "",
      created_at: "2025-04-05T11:00:00.000Z",
      updated_at: "2025-06-10T16:00:00.000Z",
    },
    {
      _id: "5",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      date_of_birth: "1997-07-18",
      role_id: "3",
      verified: "Verified",
      location: "Cần Thơ",
      avatar: "",
      created_at: "2025-05-12T12:00:00.000Z",
      updated_at: "2025-05-12T12:00:00.000Z",
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    setUsers(mockUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleName = (roleId) => {
    const role = mockRoles.find((r) => r._id === roleId);
    return role ? role.name : "Unknown";
  };

  const handleAdd = () => {
    setModalMode("add");
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      date_of_birth: "",
      role_id: "",
      verified: "Unverified",
      location: "",
      avatar: "",
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode("edit");
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
      role_id: user.role_id,
      verified: user.verified,
      location: user.location || "",
      avatar: user.avatar || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setUsers((prev) => prev.filter((u) => u._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    } else if (modalMode === "edit" && editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id
            ? { ...u, ...formData, updated_at: new Date().toISOString() }
            : u
        )
      );
    }
    setShowModal(false);
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
          {item.avatar ? (
            <img src={item.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-800">{item.name}</span>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
      render: (item) => (
        <span className="text-gray-600">{item.email}</span>
      ),
    },
    {
      field: "date_of_birth",
      header: "Date of Birth",
      sortable: true,
      render: (item) => {
        if (!item.date_of_birth) return <span className="text-gray-400">N/A</span>;
        const date = new Date(item.date_of_birth);
        return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
      },
    },
    {
      field: "role",
      header: "Role",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
          {item.roleName}
        </span>
      ),
    },
    {
      field: "verified",
      header: "Status",
      sortable: true,
      render: (item) => (
        item.verified === "Verified" ? (
          <span className="px-2 py-1 text-xs border border-green-600 bg-green-100 text-green-600 rounded-full">
            Verified
          </span>
        ) : (
          <span className="px-2 py-1 text-xs border border-orange-600 bg-orange-100 text-orange-600 rounded-full">
            Unverified
          </span>
        )
      ),
    },
    {
      field: "created_at",
      header: "Created At",
      sortable: true,
      render: (item) => {
        const date = new Date(item.created_at);
        return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
      },
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          <button
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
      roleName: getRoleName(user.role_id),
    }));
  }, [users]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-1 bg-blue-50/50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system users with roles and permissions.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
        >
          <img src={assets.add_icon} alt="" className="w-4 h-4" />
          Add User
        </button>
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search users..."
        searchableFields={["name", "email", "roleName"]}
        defaultSortField="created_at"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage="No users found."
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add" ? "Add New User" : "Edit User"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role_id}
                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="">Select Role</option>
                    {mockRoles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="https://example.com/avatar.jpg"
                  />
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
                  {modalMode === "add" ? "Add User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete User</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete user "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
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
