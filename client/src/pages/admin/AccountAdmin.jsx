import React, { useState } from "react";
import { assets } from "../../assets/assets";
import DataTable from "../../components/DataTable";

const AccountAdmin = () => {
  const [admins, setAdmins] = useState([
    {
      _id: "admin_1",
      fullName: "Super Admin",
      email: "superadmin@gmail.com",
      password: "superadmin123",
      role: "Super Admin",
      phone: "0900000001",
      address: "Ho Chi Minh City",
      createdAt: "2026-06-16",
    },
    {
      _id: "admin_2",
      fullName: "Main Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "Admin",
      phone: "0900000002",
      address: "Ha Noi",
      createdAt: "2026-06-16",
    },
    {
      _id: "admin_3",
      fullName: "Blog Writer",
      email: "blogger@gmail.com",
      password: "blogger123",
      role: "Blogger",
      phone: "0900000003",
      address: "Da Nang",
      createdAt: "2026-06-16",
    },
    {
      _id: "admin_4",
      fullName: "Content Manager",
      email: "content@gmail.com",
      password: "content123",
      role: "Content Manager",
      phone: "0900000004",
      address: "Can Tho",
      createdAt: "2026-06-16",
    },
    {
      _id: "admin_1",
      fullName: "Super 2 Admin",
      email: "superadmin2@gmail.com",
      password: "superadmin12344",
      role: "Super Admin",
      phone: "0900000001",
      address: "Ho Chi Minh City",
      createdAt: "2026-06-16",
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "Admin",
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
    role: "Admin",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const normalRoles = ["Admin", "Blogger", "Content Manager"];

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2500);
  };

  const getRoleStyle = (role) => {
    if (role === "Super Admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "Admin") {
      return "bg-primary/10 text-primary";
    }

    if (role === "Blogger") {
      return "bg-orange-100 text-orange-600";
    }

    if (role === "Content Manager") {
      return "bg-green-100 text-green-600";
    }

    return "bg-gray-100 text-gray-600";
  };

  const getPasswordPreview = (password) => {
    if (!password) return "No password";
    return "•".repeat(Math.min(password.length, 12));
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
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInfoInputChange = (e) => {
    const { name, value } = e.target;

    setInfoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const role = formData.role;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      showMessage("error", "Please fill in all fields.");
      return;
    }

    if (!normalRoles.includes(role)) {
      showMessage("error", "Invalid role selected.");
      return;
    }

    const isEmailExist = admins.some((admin) => admin.email === email);

    if (isEmailExist) {
      showMessage("error", "This email already exists.");
      return;
    }

    if (password.length < 6) {
      showMessage("error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("error", "Passwords do not match.");
      return;
    }

    const newAdmin = {
      _id: `admin_${Date.now()}`,
      fullName,
      email,
      phone,
      address,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    setAdmins((prev) => [newAdmin, ...prev]);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      role: "Admin",
      password: "",
      confirmPassword: "",
    });

    showMessage("success", "Account added successfully.");
  };

  const handleDeleteAdmin = (adminId) => {
    const admin = admins.find((item) => item._id === adminId);

    if (!admin) return;

    if (admin.role === "Super Admin") {
      showMessage("error", "Super Admin account cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${admin.fullName}?`,
    );

    if (!confirmDelete) return;

    setAdmins((prev) => prev.filter((item) => item._id !== adminId));

    showMessage("success", "Account deleted successfully.");
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
  };

  const closePasswordModal = () => {
    setSelectedPasswordAdmin(null);

    setPasswordData({
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!selectedPasswordAdmin) return;

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showMessage("error", "New passwords do not match.");
      return;
    }

    setAdmins((prev) =>
      prev.map((admin) =>
        admin._id === selectedPasswordAdmin._id
          ? {
              ...admin,
              password: passwordData.newPassword,
            }
          : admin,
      ),
    );

    closePasswordModal();

    showMessage(
      "success",
      `Password updated for ${selectedPasswordAdmin.fullName}.`,
    );
  };

  const openInfoModal = (admin) => {
    setSelectedInfoAdmin(admin);

    setInfoData({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      address: admin.address,
      role: admin.role,
    });
  };

  const closeInfoModal = () => {
    setSelectedInfoAdmin(null);

    setInfoData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      role: "Admin",
    });
  };

  const handleUpdateInformation = (e) => {
    e.preventDefault();

    if (!selectedInfoAdmin) return;

    const fullName = infoData.fullName.trim();
    const email = infoData.email.trim().toLowerCase();
    const phone = infoData.phone.trim();
    const address = infoData.address.trim();
    const role = infoData.role;

    if (!fullName || !email || !phone || !address || !role) {
      showMessage("error", "Please fill in all fields.");
      return;
    }

    const isSuperAdmin = selectedInfoAdmin.role === "Super Admin";

    if (isSuperAdmin && role !== "Super Admin") {
      showMessage("error", "Super Admin role cannot be changed.");
      return;
    }

    if (!isSuperAdmin && role === "Super Admin") {
      showMessage("error", "Only one Super Admin account is allowed.");
      return;
    }

    if (!isSuperAdmin && !normalRoles.includes(role)) {
      showMessage("error", "Invalid role selected.");
      return;
    }

    const isEmailExist = admins.some(
      (admin) => admin.email === email && admin._id !== selectedInfoAdmin._id,
    );

    if (isEmailExist) {
      showMessage("error", "This email already exists.");
      return;
    }

    setAdmins((prev) =>
      prev.map((admin) =>
        admin._id === selectedInfoAdmin._id
          ? {
              ...admin,
              fullName,
              email,
              phone,
              address,
              role,
            }
          : admin,
      ),
    );

    closeInfoModal();

    showMessage("success", "Account information updated successfully.");
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
    {
      value: "Super Admin",
      label: "Super Admin",
      filterFn: (data) => data.filter((item) => item.role === "Super Admin"),
    },
    {
      value: "Admin",
      label: "Admin",
      filterFn: (data) => data.filter((item) => item.role === "Admin"),
    },
    {
      value: "Blogger",
      label: "Blogger",
      filterFn: (data) => data.filter((item) => item.role === "Blogger"),
    },
    {
      value: "Content Manager",
      label: "Content Manager",
      filterFn: (data) =>
        data.filter((item) => item.role === "Content Manager"),
    },
  ];

  const tableAdmins = admins.map((admin, index) => ({
    ...admin,
    no: index + 1,
  }));

  const accountColumns = [
    {
      field: "no",
      header: "#",
      cellClassName: "font-medium text-gray-700",
    },
    {
      field: "fullName",
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
              {item.fullName}
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
          <option value="delete" disabled={item.role === "Super Admin"}>
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
                <option value="Admin">Admin</option>
                <option value="Blogger">Blogger</option>
                <option value="Content Manager">Content Manager</option>
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
            columns={accountColumns}
            searchPlaceholder="Search accounts..."
            searchableFields={["fullName", "email", "role", "phone", "address"]}
            filterLabel="Role"
            filterOptions={roleFilterOptions}
            defaultSortField="createdAt"
            defaultSortOrder="desc"
            itemsPerPageOptions={[5, 10, 20]}
            emptyMessage="No accounts found."
          />
        </div>
      </div>

      {detailAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View full account information
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Name</span>
                <span className="font-medium text-gray-700 text-right">
                  {detailAdmin.fullName}
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
                    {showDetailPassword
                      ? detailAdmin.password
                      : getPasswordPreview(detailAdmin.password)}
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
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getRoleStyle(
                    detailAdmin.role,
                  )}`}
                >
                  {detailAdmin.role}
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

      {selectedPasswordAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Update Password
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Change password for{" "}
              <span className="font-medium text-primary">
                {selectedPasswordAdmin.fullName}
              </span>
            </p>

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

      {selectedInfoAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleUpdateInformation}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Update Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Edit information for{" "}
              <span className="font-medium text-primary">
                {selectedInfoAdmin.fullName}
              </span>
            </p>

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
                  disabled={selectedInfoAdmin.role === "Super Admin"}
                  className={`w-full mt-1 p-2 border border-gray-300 outline-none rounded bg-white ${
                    selectedInfoAdmin.role === "Super Admin"
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  required
                >
                  {selectedInfoAdmin.role === "Super Admin" && (
                    <option value="Super Admin">Super Admin</option>
                  )}
                  <option value="Admin">Admin</option>
                  <option value="Blogger">Blogger</option>
                  <option value="Content Manager">Content Manager</option>
                </select>

                {selectedInfoAdmin.role === "Super Admin" && (
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
