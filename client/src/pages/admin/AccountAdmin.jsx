import React, { useState } from "react";
import { assets } from "../../assets/assets";
import DataTable from "../../components/DataTable";
import { staffService } from "../../services/admin.service";
import { normalizeRoleCode } from "../../utils/permission";
import { ROLE_OPTIONS } from "../../constants/rbac";

const AccountAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "admin",
    password: "",
    confirmPassword: "",
  });

  const [selectedPasswordAdmin, setSelectedPasswordAdmin] = useState(null);
  const [selectedInfoAdmin, setSelectedInfoAdmin] = useState(null);
  const [selectedDetailAdmin, setSelectedDetailAdmin] = useState(null);

  const [showDetailPassword, setShowDetailPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [infoData, setInfoData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "admin",
  });

  const [formError, setFormError] = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await staffService.getAll();
      if (response.data) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const normalRoles = ["Admin", "Content Manager", "Blogger"];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2500);
  };

  const getRoleStyle = (role) => {
    const normalizedRole = normalizeRoleCode(role);
    
    if (normalizedRole === "super_admin") {
      return "bg-purple-100 text-purple-700";
    }
    if (normalizedRole === "admin") {
      return "bg-primary/10 text-primary";
    }
    if (normalizedRole === "blogger") {
      return "bg-orange-100 text-orange-600";
    }
    if (normalizedRole === "content_manager") {
      return "bg-green-100 text-green-600";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getRoleLabel = (role) => {
    const roleOption = ROLE_OPTIONS.find((r) => r.code === normalizeRoleCode(role));
    return roleOption ? roleOption.label : role;
  };

  const getPasswordPreview = (password) => {
    if (!password) return "••••••••";
    return "•".repeat(Math.min(password.length, 8));
  };

  const detailAdmin = selectedDetailAdmin
    ? admins.find((admin) => admin._id === selectedDetailAdmin._id)
    : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const handleInfoInputChange = (e) => {
    const { name, value } = e.target;
    setInfoData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFormError("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const role = formData.role;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName || !email || !phone || !address || !role || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (!normalRoles.includes(role) && role !== "admin") {
      setFormError("Invalid role selected.");
      return;
    }

    const isEmailExist = admins.some((admin) => admin.email === email);
    if (isEmailExist) {
      setFormError("This email already exists.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const response = await staffService.create({
        name: fullName,
        email,
        phone,
        address,
        role,
        password,
      });

      if (response.data) {
        setAdmins((prev) => [response.data, ...prev]);
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "admin",
        password: "",
        confirmPassword: "",
      });

      showMessage("success", "Account added successfully.");
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to add account.");
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const admin = admins.find((item) => item._id === adminId);
    if (!admin) return;

    if (normalizeRoleCode(admin.role) === "super_admin") {
      showMessage("error", "Super Admin account cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${admin.name || admin.fullName}?`
    );

    if (!confirmDelete) return;

    try {
      await staffService.delete(adminId);
      setAdmins((prev) => prev.filter((item) => item._id !== adminId));
      showMessage("success", "Account deleted successfully.");
    } catch (error) {
      showMessage("error", "Failed to delete account.");
    }
  };

  const openDetailModal = (admin) => {
    setSelectedDetailAdmin(admin);
    setShowDetailPassword(false);
  };

  const closeDetailModal = () => {
    setSelectedDetailAdmin(null);
    setShowDetailPassword(false);
  };

  const openPasswordModal = (admin) => {
    setSelectedPasswordAdmin(admin);
    setPasswordData({
      newPassword: "",
      confirmNewPassword: "",
    });
    setFormError("");
  };

  const closePasswordModal = () => {
    setSelectedPasswordAdmin(null);
    setPasswordData({
      newPassword: "",
      confirmNewPassword: "",
    });
    setFormError("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedPasswordAdmin) return;

    if (passwordData.newPassword.length < 6) {
      setFormError("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setFormError("New passwords do not match.");
      return;
    }

    try {
      await staffService.resetPassword(selectedPasswordAdmin._id, passwordData.newPassword);
      closePasswordModal();
      showMessage("success", `Password updated for ${selectedPasswordAdmin.name || selectedPasswordAdmin.fullName}.`);
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to update password.");
    }
  };

  const openInfoModal = (admin) => {
    setSelectedInfoAdmin(admin);
    setInfoData({
      fullName: admin.name || admin.fullName || "",
      email: admin.email || "",
      phone: admin.phone || "",
      address: admin.address || "",
      role: admin.role || "admin",
    });
    setFormError("");
  };

  const closeInfoModal = () => {
    setSelectedInfoAdmin(null);
    setInfoData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      role: "admin",
    });
    setFormError("");
  };

  const handleUpdateInformation = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedInfoAdmin) return;

    const fullName = infoData.fullName.trim();
    const email = infoData.email.trim().toLowerCase();
    const phone = infoData.phone.trim();
    const address = infoData.address.trim();
    const role = infoData.role;

    if (!fullName || !email || !phone || !address || !role) {
      setFormError("Please fill in all fields.");
      return;
    }

    const isSuperAdmin = normalizeRoleCode(selectedInfoAdmin.role) === "super_admin";

    if (isSuperAdmin && role !== "super_admin") {
      setFormError("Super Admin role cannot be changed.");
      return;
    }

    if (!isSuperAdmin && role === "super_admin") {
      setFormError("Only one Super Admin account is allowed.");
      return;
    }

    const isEmailExist = admins.some(
      (admin) => admin.email === email && admin._id !== selectedInfoAdmin._id
    );

    if (isEmailExist) {
      setFormError("This email already exists.");
      return;
    }

    try {
      const response = await staffService.update(selectedInfoAdmin._id, {
        name: fullName,
        email,
        phone,
        address,
        role,
      });

      if (response.data) {
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === selectedInfoAdmin._id ? { ...admin, ...response.data } : admin
          )
        );
      }

      closeInfoModal();
      showMessage("success", "Account information updated successfully.");
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to update account.");
    }
  };

  const handleActionChange = (action, admin) => {
    if (!action) return;

    if (action === "update-password") {
      openPasswordModal(admin);
    }
    if (action === "update-information") {
      openInfoModal(admin);
    }
    if (action === "delete") {
      handleDeleteAdmin(admin._id);
    }
  };

  const roleFilterOptions = [
    { value: "super_admin", label: "Super Admin", filterFn: (data) => data.filter((item) => normalizeRoleCode(item.role) === "super_admin") },
    { value: "admin", label: "Admin", filterFn: (data) => data.filter((item) => normalizeRoleCode(item.role) === "admin") },
    { value: "blogger", label: "Blogger", filterFn: (data) => data.filter((item) => normalizeRoleCode(item.role) === "blogger") },
    { value: "content_manager", label: "Content Manager", filterFn: (data) => data.filter((item) => normalizeRoleCode(item.role) === "content_manager") },
  ];

  const tableAdmins = admins.map((admin, index) => ({
    ...admin,
    no: index + 1,
    displayName: admin.name || admin.fullName || "N/A",
    displayRole: getRoleLabel(admin.role),
  }));

  const columns = [
    {
      field: "no",
      header: "#",
      cellClassName: "font-medium text-gray-700",
    },
    {
      field: "displayName",
      header: "NAME",
      render: (item) => (
        <button
          type="button"
          onClick={() => openDetailModal(item)}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <img src={assets.user_icon} alt="" className="w-5" />
          </div>
          <div>
            <p className="font-medium text-gray-700 group-hover:text-primary">
              {item.displayName}
            </p>
            <p className="text-xs text-gray-400 group-hover:text-primary">
              Click to view details
            </p>
          </div>
        </button>
      ),
    },
    {
      field: "email",
      header: "EMAIL",
      render: (item) => <span className="text-gray-600">{item.email}</span>,
    },
    {
      field: "displayRole",
      header: "ROLE",
      render: (item) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getRoleStyle(item.role)}`}>
          {item.displayRole}
        </span>
      ),
    },
    {
      field: "createdAt",
      header: "CREATED AT",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      header: "ACTIONS",
      render: (item) => (
        <select
          defaultValue=""
          onChange={(e) => {
            handleActionChange(e.target.value, item);
            e.target.value = "";
          }}
          className="px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none cursor-pointer"
        >
          <option value="" disabled>
            Select action
          </option>
          <option value="update-password">Update Password</option>
          <option value="update-information">Update Information</option>
          <option value="delete" disabled={normalizeRoleCode(item.role) === "super_admin"}>
            Delete
          </option>
        </select>
      ),
    },
  ];

  return (
    <div className="flex-1 bg-blue-50/50 p-4 md:p-10 text-gray-600 overflow-scroll">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Account Admin</h1>
        <p className="text-sm text-gray-500">Manage administrator accounts</p>
      </div>

      {message.text && (
        <div
          className={`mb-5 px-4 py-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <form
          onSubmit={handleAddAdmin}
          className="bg-white p-5 rounded-lg shadow h-fit"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <img src={assets.user_icon} alt="" className="w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Add New Account</h2>
              <p className="text-xs text-gray-400">
                Create admin, blogger, or content manager account
              </p>
            </div>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded bg-white"
                required
              >
                <option value="admin">Admin</option>
                <option value="blogger">Blogger</option>
                <option value="content_manager">Content Manager</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Super Admin is unique and cannot be created here.
              </p>
            </div>

            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2 bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Add Account
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-5 overflow-hidden">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800">Account List</h2>
            <p className="text-xs text-gray-400 mt-1">
              Total accounts: {admins.length}
            </p>
          </div>

          <DataTable
            data={tableAdmins}
            columns={columns}
            searchPlaceholder="Search accounts..."
            searchableFields={["fullName", "name", "email", "role"]}
            filterLabel="Role"
            filterOptions={roleFilterOptions}
            defaultSortField="createdAt"
            defaultSortOrder="desc"
            itemsPerPageOptions={[5, 10, 20]}
            emptyMessage="No accounts found."
            loading={loading}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {detailAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
            <p className="text-sm text-gray-500 mt-1">View full account information</p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Name</span>
                <span className="font-medium text-gray-700 text-right">
                  {detailAdmin.name || detailAdmin.fullName}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-gray-700 text-right">
                  {detailAdmin.email}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Password</span>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-medium tracking-wider text-gray-700">
                    {showDetailPassword ? "••••••••" : getPasswordPreview(detailAdmin.password)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDetailPassword((prev) => !prev)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showDetailPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Role</span>
                <span className={`px-3 py-1 rounded-full text-xs ${getRoleStyle(detailAdmin.role)}`}>
                  {getRoleLabel(detailAdmin.role)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Created At</span>
                <span className="font-medium text-gray-700 text-right">
                  {new Date(detailAdmin.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Phone</span>
                <span className="font-medium text-gray-700 text-right">
                  {detailAdmin.phone}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Address</span>
                <span className="font-medium text-gray-700 text-right">
                  {detailAdmin.address}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={closeDetailModal}
                className="px-5 py-2 bg-primary text-white rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {selectedPasswordAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">Update Password</h2>
            <p className="text-sm text-gray-500 mt-1">
              Change password for{" "}
              <span className="font-medium text-primary">
                {selectedPasswordAdmin.name || selectedPasswordAdmin.fullName}
              </span>
            </p>

            {formError && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                {formError}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-sm">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closePasswordModal}
                className="px-5 py-2 border border-gray-300 rounded cursor-pointer text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info Modal */}
      {selectedInfoAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdateInformation}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">Update Information</h2>
            <p className="text-sm text-gray-500 mt-1">
              Edit information for{" "}
              <span className="font-medium text-primary">
                {selectedInfoAdmin.name || selectedInfoAdmin.fullName}
              </span>
            </p>

            {formError && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                {formError}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-sm">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={infoData.fullName}
                  onChange={handleInfoInputChange}
                  placeholder="Enter full name"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={infoData.email}
                  onChange={handleInfoInputChange}
                  placeholder="Enter email"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={infoData.phone}
                  onChange={handleInfoInputChange}
                  placeholder="Enter phone number"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={infoData.address}
                  onChange={handleInfoInputChange}
                  placeholder="Enter address"
                  className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Role</label>
                <select
                  name="role"
                  value={infoData.role}
                  onChange={handleInfoInputChange}
                  disabled={normalizeRoleCode(selectedInfoAdmin.role) === "super_admin"}
                  className={`w-full mt-1 p-2 border border-gray-300 outline-none rounded bg-white ${
                    normalizeRoleCode(selectedInfoAdmin.role) === "super_admin"
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  required
                >
                  {normalizeRoleCode(selectedInfoAdmin.role) === "super_admin" && (
                    <option value="super_admin">Super Admin</option>
                  )}
                  <option value="admin">Admin</option>
                  <option value="blogger">Blogger</option>
                  <option value="content_manager">Content Manager</option>
                </select>
                {normalizeRoleCode(selectedInfoAdmin.role) === "super_admin" && (
                  <p className="text-xs text-gray-400 mt-1">
                    Super Admin role cannot be changed.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeInfoModal}
                className="px-5 py-2 border border-gray-300 rounded cursor-pointer text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountAdmin;
