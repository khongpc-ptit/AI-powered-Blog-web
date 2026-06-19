import React, { useEffect, useMemo, useState } from "react";
import { roleApi } from "../../services/role.api";

const Permissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);

  const [newRoleData, setNewRoleData] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);
  };

  const clearMessage = () => {
    setMessage({
      type: "",
      text: "",
    });
  };

  const getErrorMessage = (err) => {
    if (err?.status === 401) {
      return err.message || "Bạn chưa đăng nhập hoặc token không hợp lệ.";
    }

    if (err?.status === 403) {
      return err.message || "Bạn không có quyền thực hiện thao tác này.";
    }

    if (err?.status === 409) {
      return err.message || "Role name already exists.";
    }

    if (err?.status === 404) {
      return err.message || "Role not found.";
    }

    if (err?.status === 422) {
      if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        return firstError?.msg || err.message || "Dữ liệu không hợp lệ.";
      }

      return err.message || "Dữ liệu không hợp lệ.";
    }

    if (err?.errors) {
      const firstError = Object.values(err.errors)[0];
      return firstError?.msg || err.message || "Dữ liệu không hợp lệ.";
    }

    return err?.message || "Có lỗi xảy ra.";
  };

  const formatRoleName = (name) => {
    if (!name) return "N/A";

    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isUserRole = (role) => {
    return role?.name?.toLowerCase() === "user";
  };

  const isSuperAdminRole = (role) => {
    const roleName = role?.name?.toLowerCase();

    return roleName === "super_admin" || roleName === "super admin";
  };

  const selectedRole = useMemo(() => {
    return roles.find((role) => role._id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  const isSelectedRoleLocked = selectedRole
    ? isSuperAdminRole(selectedRole)
    : false;

  const selectedRolePermissionCount = selectedPermissions.length;

  const permissionGroups = useMemo(() => {
    const groups = {
      DASHBOARD: {
        title: "Dashboard",
        permissions: [],
      },
      POST: {
        title: "Bài viết",
        permissions: [],
      },
      CATEGORY: {
        title: "Danh mục",
        permissions: [],
      },
      COMMENT: {
        title: "Bình luận",
        permissions: [],
      },
      USER: {
        title: "Người dùng",
        permissions: [],
      },
      ADMIN: {
        title: "Quản trị viên & Phân quyền",
        permissions: [],
      },
      OTHER: {
        title: "Khác",
        permissions: [],
      },
    };

    permissions.forEach((permission) => {
      const code = permission.code || "";

      if (code.includes("DASHBOARD")) {
        groups.DASHBOARD.permissions.push(permission);
      } else if (code.includes("POST")) {
        groups.POST.permissions.push(permission);
      } else if (code.includes("CATEGORY")) {
        groups.CATEGORY.permissions.push(permission);
      } else if (code.includes("COMMENT")) {
        groups.COMMENT.permissions.push(permission);
      } else if (code.includes("USER")) {
        groups.USER.permissions.push(permission);
      } else if (code.includes("ADMIN") || code.includes("PERMISSION")) {
        groups.ADMIN.permissions.push(permission);
      } else {
        groups.OTHER.permissions.push(permission);
      }
    });

    return Object.values(groups).filter(
      (group) => group.permissions.length > 0,
    );
  }, [permissions]);

  const fetchPermissions = async () => {
    const data = await roleApi.getPermissions();
    setPermissions(data.result || []);
  };

  const fetchRoles = async () => {
    const data = await roleApi.getRoles();

    const roleList = data.result || [];

    // Bỏ USER khỏi frontend
    const roleListWithoutUser = roleList.filter((role) => !isUserRole(role));

    setRoles(roleListWithoutUser);

    if (roleListWithoutUser.length > 0) {
      const firstRole = roleListWithoutUser[0];

      setSelectedRoleId((prev) => {
        const isCurrentRoleStillExists = roleListWithoutUser.some(
          (role) => role._id === prev,
        );

        return isCurrentRoleStillExists ? prev : firstRole._id;
      });
    } else {
      setSelectedRoleId("");
      setSelectedPermissions([]);
    }
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      clearMessage();

      await Promise.all([fetchPermissions(), fetchRoles()]);
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    if (!selectedRole) {
      setSelectedPermissions([]);
      return;
    }

    setSelectedPermissions(selectedRole.permissions || []);
  }, [selectedRole]);

  const handleSelectRole = (role) => {
    setSelectedRoleId(role._id);
    setSelectedPermissions(role.permissions || []);
    clearMessage();
  };

  const hasPermission = (permissionCode) => {
    return selectedPermissions.includes(permissionCode);
  };

  const handleTogglePermission = (permissionCode) => {
    if (!selectedRole) return;

    if (isSuperAdminRole(selectedRole)) {
      showMessage("error", "Super Admin đã bị khóa, không thể sửa quyền.");
      return;
    }

    setSelectedPermissions((prev) => {
      const isExisting = prev.includes(permissionCode);

      if (isExisting) {
        return prev.filter((item) => item !== permissionCode);
      }

      return [...prev, permissionCode];
    });

    clearMessage();
  };

  const handleSave = async () => {
    if (!selectedRole) {
      showMessage("error", "Vui lòng chọn role cần cập nhật quyền.");
      return;
    }

    if (isSuperAdminRole(selectedRole)) {
      showMessage("error", "Super Admin đã bị khóa, không thể cập nhật quyền.");
      return;
    }

    try {
      setSaving(true);
      clearMessage();

      await roleApi.updateRolePermissions(
        selectedRole._id,
        selectedPermissions,
      );

      await fetchRoles();

      showMessage("success", "Đã cập nhật quyền cho role thành công.");
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = (role) => {
    if (!role) return;

    if (isSuperAdminRole(role)) {
      showMessage("error", "Không thể xóa Super Admin.");
      return;
    }

    setDeleteConfirmRole(role);
  };

  const confirmDeleteRole = async () => {
    if (!deleteConfirmRole) return;

    try {
      setDeletingRoleId(deleteConfirmRole._id);
      clearMessage();

      await roleApi.deleteRole(deleteConfirmRole._id);

      const rolesData = await roleApi.getRoles();
      const roleList = rolesData.result || [];
      const roleListWithoutUser = roleList.filter((item) => !isUserRole(item));

      setRoles(roleListWithoutUser);

      if (selectedRoleId === deleteConfirmRole._id) {
        const nextRole = roleListWithoutUser[0];

        setSelectedRoleId(nextRole?._id || "");
        setSelectedPermissions(nextRole?.permissions || []);
      }

      showMessage(
        "success",
        `Đã xóa role "${formatRoleName(deleteConfirmRole.name)}" thành công.`,
      );

      setDeleteConfirmRole(null);
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    } finally {
      setDeletingRoleId("");
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;

    setNewRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleNewRolePermission = (permissionCode) => {
    setNewRoleData((prev) => {
      const currentPermissions = prev.permissions || [];
      const isExisting = currentPermissions.includes(permissionCode);

      const updatedPermissions = isExisting
        ? currentPermissions.filter((item) => item !== permissionCode)
        : [...currentPermissions, permissionCode];

      return {
        ...prev,
        permissions: updatedPermissions,
      };
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewRoleData({
      name: "",
      description: "",
      permissions: [],
    });
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    clearMessage();

    const payload = {
      name: newRoleData.name.trim(),
      description: newRoleData.description.trim(),
      permissions: newRoleData.permissions || [],
    };

    if (!payload.name) {
      showMessage("error", "Vui lòng nhập tên role.");
      return;
    }

    if (payload.name.toLowerCase() === "user") {
      showMessage("error", "Không tạo role USER ở trang phân quyền admin.");
      return;
    }

    if (
      payload.name.toLowerCase() === "super_admin" ||
      payload.name.toLowerCase() === "super admin"
    ) {
      showMessage("error", "Không tạo thêm role Super Admin.");
      return;
    }

    try {
      await roleApi.createRole(payload);

      closeCreateModal();

      const rolesData = await roleApi.getRoles();
      const roleList = rolesData.result || [];
      const roleListWithoutUser = roleList.filter((role) => !isUserRole(role));

      setRoles(roleListWithoutUser);

      const createdRole = roleListWithoutUser.find(
        (role) => role.name.toLowerCase() === payload.name.toLowerCase(),
      );

      if (createdRole) {
        setSelectedRoleId(createdRole._id);
        setSelectedPermissions(createdRole.permissions || []);
      }

      showMessage("success", `Đã tạo role "${payload.name}" thành công.`);
    } catch (err) {
      showMessage("error", getErrorMessage(err));
    }
  };

  const countPermissionsByRole = (role) => {
    return role?.permissions?.length || 0;
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50 overflow-y-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Roles & Permissions
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded text-sm bg-primary text-white cursor-pointer hover:bg-primary/90"
          >
            Create New Role
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving || loading || !selectedRole || isSelectedRoleLocked
            }
            className={`px-4 py-2 rounded text-sm ${
              saving || loading || !selectedRole || isSelectedRoleLocked
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white cursor-pointer hover:bg-primary/90"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-5 rounded-lg p-4 text-sm border ${
            message.type === "success"
              ? "bg-green-50 border-green-100 text-green-600"
              : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Loading roles and permissions...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden h-fit">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Role List</h2>
              <p className="text-sm text-gray-500 mt-1">
                Chọn role cần phân quyền.
              </p>
            </div>

            <div className="p-3 flex flex-col gap-2 max-h-[680px] overflow-y-auto">
              {roles.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  Không có role quản trị nào.
                </div>
              ) : (
                roles.map((role) => {
                  const isActive = selectedRoleId === role._id;
                  const isSuper = isSuperAdminRole(role);
                  const isDeleting = deletingRoleId === role._id;

                  return (
                    <button
                      key={role._id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={`text-left rounded-lg border p-4 transition-all cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-gray-100 bg-white hover:border-primary/40 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {formatRoleName(role.name)}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            ID: {role._id}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {isSuper && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                              LOCKED
                            </span>
                          )}

                          {!isSuper && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                              EDITABLE
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-3 leading-5">
                        {role.description || "No description"}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-primary font-medium">
                          {countPermissionsByRole(role)} permissions
                        </p>

                        {!isSuper && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role);
                            }}
                            className={`text-xs ${
                              isDeleting
                                ? "text-gray-400"
                                : "text-red-500 hover:underline"
                            }`}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Permissions for{" "}
                  <span className="text-primary">
                    {selectedRole ? formatRoleName(selectedRole.name) : "N/A"}
                  </span>
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedRole?.description || "No description"}
                </p>

                {selectedRole && (
                  <p className="text-xs text-gray-400 mt-1">
                    Role ID: {selectedRole._id}
                  </p>
                )}
              </div>

              <div className="text-sm bg-primary/5 text-primary px-4 py-2 rounded-lg h-fit">
                {selectedRolePermissionCount} permissions selected
              </div>
            </div>

            {isSelectedRoleLocked && (
              <div className="m-5 bg-orange-50 border border-orange-100 text-orange-600 rounded-lg p-4 text-sm">
                Super Admin là role toàn quyền và đã bị khóa. Không thể sửa
                quyền hoặc xóa role này.
              </div>
            )}

            <div className="p-5 space-y-5">
              {permissionGroups.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Không có permission nào.
                </div>
              ) : (
                permissionGroups.map((group) => (
                  <div
                    key={group.title}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <div className="bg-primary/5 px-4 py-3">
                      <h3 className="font-semibold text-primary">
                        {group.title}
                      </h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {group.permissions.map((permission) => {
                        const checked = hasPermission(permission.code);

                        return (
                          <label
                            key={permission.code}
                            className={`flex items-start gap-4 p-4 ${
                              isSelectedRoleLocked
                                ? "cursor-not-allowed bg-gray-50/60"
                                : "cursor-pointer hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isSelectedRoleLocked}
                              onChange={() =>
                                handleTogglePermission(permission.code)
                              }
                              className="mt-1 scale-125 cursor-pointer disabled:cursor-not-allowed"
                            />

                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="font-medium text-gray-800">
                                  {permission.name}
                                </p>

                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded w-fit">
                                  {permission.code}
                                </span>
                              </div>

                              <p className="text-sm text-gray-500 mt-1">
                                {permission.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirmRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800">Delete Role</h2>

            <p className="text-sm text-gray-500 mt-3">
              Bạn có chắc muốn xóa role{" "}
              <span className="font-semibold text-gray-800">
                "{formatRoleName(deleteConfirmRole.name)}"
              </span>{" "}
              không?
            </p>

            <p className="text-xs text-red-500 mt-3">
              Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmRole(null)}
                className="px-5 py-2 border border-gray-300 rounded cursor-pointer text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteRole}
                disabled={deletingRoleId === deleteConfirmRole._id}
                className={`px-5 py-2 rounded text-white ${
                  deletingRoleId === deleteConfirmRole._id
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 cursor-pointer"
                }`}
              >
                {deletingRoleId === deleteConfirmRole._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Create New Role
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tạo role mới và chọn quyền cho role.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="p-6 space-y-5">
              <div>
                <label className="text-sm text-gray-600">Role name *</label>
                <input
                  type="text"
                  name="name"
                  value={newRoleData.name}
                  onChange={handleCreateInputChange}
                  placeholder="VD: Editor"
                  autoFocus
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={newRoleData.description}
                  onChange={handleCreateInputChange}
                  placeholder="Mô tả role này..."
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary h-24 resize-none"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Permissions
                </h3>

                <div className="space-y-4">
                  {permissionGroups.map((group) => (
                    <div
                      key={group.title}
                      className="border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <div className="bg-primary/5 px-4 py-3">
                        <h4 className="font-semibold text-primary">
                          {group.title}
                        </h4>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {group.permissions.map((permission) => {
                          const checked = newRoleData.permissions.includes(
                            permission.code,
                          );

                          return (
                            <label
                              key={permission.code}
                              className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handleToggleNewRolePermission(permission.code)
                                }
                                className="mt-1 scale-125 cursor-pointer"
                              />

                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <p className="font-medium text-gray-800">
                                    {permission.name}
                                  </p>

                                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded w-fit">
                                    {permission.code}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-500 mt-1">
                                  {permission.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 rounded text-sm border bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded text-sm bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;
