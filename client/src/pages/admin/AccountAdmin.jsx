import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import DataTable from "../../components/DataTable";
import { staffApi } from "../../services/staff.api";
import { roleApi } from "../../services/role.api";

const AccountAdmin = () => {
  const [staffs, setStaffs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDetailStaff, setSelectedDetailStaff] = useState(null);
  const [selectedPasswordStaff, setSelectedPasswordStaff] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total_pages: 1,
    total_items: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    role_id: "",
    location: "",
  });

  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_new_password: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const getErrorMessage = (err) => {
    if (err?.status === 400) {
      return err.message || "Yêu cầu không hợp lệ.";
    }

    if (err?.status === 401) {
      return err.message || "Bạn chưa đăng nhập hoặc token không hợp lệ.";
    }

    if (err?.status === 403) {
      return err.message || "Bạn không có quyền thực hiện thao tác này.";
    }

    if (err?.status === 404) {
      return err.message || "Không tìm thấy nhân sự hoặc role.";
    }

    if (err?.status === 409) {
      return err.message || "Dữ liệu đã tồn tại.";
    }

    if (err?.status === 422) {
      if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        return firstError?.msg || err.message || "Dữ liệu không hợp lệ.";
      }

      return err.message || "Dữ liệu không hợp lệ.";
    }

    if (err?.status === 500) {
      return err.message || "Lỗi server.";
    }

    if (err?.errors) {
      const firstError = Object.values(err.errors)[0];
      return firstError?.msg || err.message || "Dữ liệu không hợp lệ.";
    }

    return err?.message || "Có lỗi xảy ra.";
  };

  const formatDateForTable = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("vi-VN");
  };

  const formatDateToISO = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
  };

  const formatRoleName = (roleName) => {
    if (!roleName || roleName === "N/A") return "N/A";

    return roleName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getRoleIdValue = (roleValue) => {
    if (!roleValue) return "";

    if (typeof roleValue === "object") {
      return (
        roleValue._id || roleValue.id || roleValue.$oid || roleValue.value || ""
      );
    }

    return roleValue;
  };

  const getStaffRoleId = (staff) => {
    return getRoleIdValue(
      staff?.role_id ||
        staff?.roleId ||
        staff?.role ||
        staff?.role_id?._id ||
        staff?.role?._id,
    );
  };

  const getStaffRoleName = (staff) => {
    if (!staff) return "N/A";

    if (staff.role_name) return staff.role_name;

    if (typeof staff.role_id === "object" && staff.role_id?.name) {
      return staff.role_id.name;
    }

    if (typeof staff.role === "object" && staff.role?.name) {
      return staff.role.name;
    }

    if (typeof staff.role === "string") {
      const roleByName = roles.find(
        (role) => role.name?.toLowerCase() === staff.role.toLowerCase(),
      );

      if (roleByName) return roleByName.name;
    }

    const roleId = getStaffRoleId(staff);

    const role = roles.find((item) => {
      return getRoleIdValue(item._id) === roleId;
    });

    return role ? role.name : "N/A";
  };

  const isUserRole = (role) => {
    return role?.name?.toLowerCase() === "user";
  };

  const isSuperAdminRoleName = (roleName) => {
    const normalizedRole = roleName?.toLowerCase();

    return normalizedRole === "super_admin" || normalizedRole === "super admin";
  };

  const isSuperAdminRole = (role) => {
    return isSuperAdminRoleName(role?.name);
  };

  const isSuperAdminStaff = (staff) => {
    return isSuperAdminRoleName(getStaffRoleName(staff));
  };

  const getAvailableRolesForCreate = () => {
    return roles.filter((role) => !isUserRole(role) && !isSuperAdminRole(role));
  };

  const getRoleStyle = (roleName) => {
    const normalizedRole = roleName?.toLowerCase();

    if (normalizedRole === "super_admin" || normalizedRole === "super admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (normalizedRole === "admin") {
      return "bg-primary/10 text-primary";
    }

    if (
      normalizedRole === "content_manager" ||
      normalizedRole === "content manager"
    ) {
      return "bg-green-100 text-green-600";
    }

    if (normalizedRole === "blogger") {
      return "bg-orange-100 text-orange-600";
    }

    return "bg-gray-100 text-gray-600";
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      clearMessage();

      const [staffData, roleData] = await Promise.all([
        staffApi.getStaffs({
          page: 1,
          limit: 100,
          search: "",
        }),
        roleApi.getRoles(),
      ]);

      setStaffs(staffData.result || []);
      setRoles(roleData.result || []);

      if (staffData.pagination) {
        setPagination(staffData.pagination);
      }
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    try {
      setLoading(true);

      const data = await staffApi.getStaffs({
        page: 1,
        limit: 100,
        search: "",
      });

      setStaffs(data.result || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

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

  const resetAddForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      date_of_birth: "",
      role_id: "",
      location: "",
    });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    clearMessage();

    const selectedRole = roles.find((role) => role._id === formData.role_id);

    if (selectedRole && isUserRole(selectedRole)) {
      showMessage("error", "Không thể tạo tài khoản staff với role USER.");
      return;
    }

    if (selectedRole && isSuperAdminRole(selectedRole)) {
      showMessage("error", "Không thể tạo thêm tài khoản Super Admin.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirm_password: formData.confirm_password,
      date_of_birth: formatDateToISO(formData.date_of_birth),
      role_id: formData.role_id.trim(),
      location: formData.location.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.password ||
      !payload.confirm_password ||
      !payload.date_of_birth ||
      !payload.role_id
    ) {
      showMessage(
        "error",
        "Vui lòng nhập đầy đủ tên, email, mật khẩu, ngày sinh và role.",
      );
      return;
    }

    if (payload.password !== payload.confirm_password) {
      showMessage("error", "Confirm password không khớp với password.");
      return;
    }

    try {
      await staffApi.createStaff(payload);

      resetAddForm();
      await fetchStaffs();

      showMessage("success", "Tạo tài khoản nhân sự thành công.");
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    }
  };

  const openDetailModal = (staff) => {
    setSelectedDetailStaff(staff);
  };

  const closeDetailModal = () => {
    setSelectedDetailStaff(null);
  };

  const openPasswordModal = (staff) => {
    setSelectedPasswordStaff(staff);

    setPasswordData({
      new_password: "",
      confirm_new_password: "",
    });
  };

  const closePasswordModal = () => {
    setSelectedPasswordStaff(null);

    setPasswordData({
      new_password: "",
      confirm_new_password: "",
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!selectedPasswordStaff) return;

    if (!passwordData.new_password) {
      showMessage("error", "Vui lòng nhập mật khẩu mới.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      showMessage("error", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_new_password) {
      showMessage("error", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await staffApi.resetStaffPassword(
        selectedPasswordStaff._id,
        passwordData.new_password,
      );

      const staffName = selectedPasswordStaff.name;

      closePasswordModal();
      await fetchStaffs();

      showMessage("success", `Đã reset mật khẩu cho ${staffName}.`);
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    }
  };

  const handleDeleteClick = (staff) => {
    clearMessage();

    if (isSuperAdminStaff(staff)) {
      showMessage("error", "Không thể xóa tài khoản Super Admin.");
      return;
    }

    setDeleteConfirm(staff);
  };

  const confirmDeleteStaff = async () => {
    if (!deleteConfirm) return;

    if (isSuperAdminStaff(deleteConfirm)) {
      showMessage("error", "Không thể xóa tài khoản Super Admin.");
      setDeleteConfirm(null);
      return;
    }

    try {
      clearMessage();

      const data = await staffApi.deleteStaff(deleteConfirm._id);

      setDeleteConfirm(null);
      await fetchStaffs();

      showMessage(
        "success",
        `Đã xóa tài khoản: ${data.result?.name || deleteConfirm.name}`,
      );
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    }
  };

  const handleActionChange = (action, staff) => {
    if (!action) return;

    if (action === "detail") {
      openDetailModal(staff);
    }

    if (action === "reset-password") {
      openPasswordModal(staff);
    }

    if (action === "delete") {
      handleDeleteClick(staff);
    }
  };

  const tableStaffs = useMemo(() => {
    return staffs.map((staff, index) => {
      const roleName = getStaffRoleName(staff);

      return {
        ...staff,
        no: index + 1,
        role_name: roleName,
        role_label: formatRoleName(roleName),
      };
    });
  }, [staffs, roles]);

  const roleFilterOptions = useMemo(() => {
    return roles
      .filter((role) => !isUserRole(role))
      .map((role) => ({
        value: role.name,
        label: formatRoleName(role.name),
        filterFn: (data) => data.filter((item) => item.role_name === role.name),
      }));
  }, [roles]);

  const accountColumns = [
    {
      field: "no",
      header: "#",
      cellClassName: "font-medium text-gray-700",
    },
    {
      field: "name",
      header: "NAME",
      sortable: true,
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
              {item.name || "No name"}
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
      sortable: true,
      render: (item) => <span>{item.email || "N/A"}</span>,
    },
    {
      field: "role_name",
      header: "ROLE",
      sortable: true,
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${getRoleStyle(
            item.role_name,
          )}`}
        >
          {item.role_label}
        </span>
      ),
    },
    {
      field: "date_of_birth",
      header: "DATE OF BIRTH",
      sortable: true,
      render: (item) => formatDateForTable(item.date_of_birth),
    },
    {
      field: "location",
      header: "LOCATION",
      sortable: true,
      render: (item) => item.location || "N/A",
    },
    {
      field: "created_at",
      header: "CREATED AT",
      sortable: true,
      render: (item) => formatDateForTable(item.created_at),
    },
    {
      field: "actions",
      header: "ACTIONS",
      render: (item) => {
        const isSuperAdmin = isSuperAdminStaff(item);

        return (
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
            <option value="detail">View Detail</option>
            <option value="reset-password">Reset Password</option>
            {!isSuperAdmin && <option value="delete">Delete</option>}
          </select>
        );
      },
    },
  ];

  return (
    <div className="flex-1 bg-blue-50/50 p-4 md:p-10 text-gray-600 overflow-scroll">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Account Admin</h1>
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
          onSubmit={handleAddStaff}
          className="bg-white p-5 rounded-lg shadow h-fit"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <img src={assets.user_icon} alt="" className="w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-800">Add New Account</h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Email *</label>
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
              <label className="text-sm">Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm">Role *</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded bg-white"
                required
              >
                <option value="">Select role</option>

                {getAvailableRolesForCreate().map((role) => (
                  <option key={role._id} value={role._id}>
                    {formatRoleName(role.name)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
              />
            </div>

            <div>
              <label className="text-sm">Password *</label>
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
              <label className="text-sm">Confirm Password *</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full mt-1 p-2 border border-gray-300 outline-none rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-2 text-white rounded transition-all ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary cursor-pointer hover:bg-primary/90"
              }`}
            >
              {loading ? "Loading..." : "Add Account"}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-5 overflow-hidden">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800">Account List</h2>
            <p className="text-xs text-gray-400 mt-1">
              Total accounts: {pagination.total_items || staffs.length}
            </p>
          </div>

          <DataTable
            data={tableStaffs}
            columns={accountColumns}
            searchPlaceholder="Search accounts..."
            searchableFields={[
              "name",
              "email",
              "role_name",
              "role_label",
              "location",
            ]}
            filterLabel="Role"
            filterOptions={roleFilterOptions}
            defaultSortField="created_at"
            defaultSortOrder="desc"
            itemsPerPageOptions={[5, 10, 20]}
            loading={loading}
            emptyMessage="No accounts found."
          />
        </div>
      </div>

      {selectedDetailStaff && (
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
                  {selectedDetailStaff.name || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-gray-700 text-right">
                  {selectedDetailStaff.email || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Password</span>

                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 text-right">
                    ********
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const staff = selectedDetailStaff;
                      closeDetailModal();
                      openPasswordModal(staff);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Role</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getRoleStyle(
                    getStaffRoleName(selectedDetailStaff),
                  )}`}
                >
                  {formatRoleName(getStaffRoleName(selectedDetailStaff))}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Date of Birth</span>
                <span className="font-medium text-gray-700 text-right">
                  {formatDateForTable(selectedDetailStaff.date_of_birth)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Location</span>
                <span className="font-medium text-gray-700 text-right">
                  {selectedDetailStaff.location || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Created At</span>
                <span className="font-medium text-gray-700 text-right">
                  {formatDateForTable(selectedDetailStaff.created_at)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span className="text-gray-400">Updated At</span>
                <span className="font-medium text-gray-700 text-right">
                  {formatDateForTable(selectedDetailStaff.updated_at)}
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

      {selectedPasswordStaff && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleResetPassword}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Reset Password
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Change password for{" "}
              <span className="font-medium text-primary">
                {selectedPasswordStaff.name}
              </span>
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-sm">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
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
                  name="confirm_new_password"
                  value={passwordData.confirm_new_password}
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Account
            </h2>

            <p className="text-sm text-gray-500 mt-3">
              Are you sure you want to delete "{deleteConfirm.name}"? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2 border border-gray-300 rounded cursor-pointer text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteStaff}
                className="px-5 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountAdmin;
