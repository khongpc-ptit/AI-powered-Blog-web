import React, { useMemo, useState } from "react";
import {
  DEFAULT_ROLES,
  PERMISSION_GROUPS,
  PERMISSIONS,
  ROLE_CODES,
} from "../../constants/rbac";
import {
  createCustomRole,
  deleteCustomRole,
  getAllRoles,
  getCurrentUser,
  getRolePermissions,
  isSuperAdmin,
  makeRoleCode,
  resetRolePermissions,
  saveRolePermissions,
} from "../../utils/permission";

const Permissions = () => {
  const currentUser = getCurrentUser();
  const canEdit = isSuperAdmin(currentUser);

  const [rolesMap, setRolesMap] = useState(() => getAllRoles());

  const roles = useMemo(() => Object.values(rolesMap), [rolesMap]);

  const firstEditableRole = roles.find(
    (role) => role.code !== ROLE_CODES.SUPER_ADMIN,
  );

  const [selectedRoleCode, setSelectedRoleCode] = useState(
    firstEditableRole?.code || ROLE_CODES.ADMIN,
  );

  const [rolePermissions, setRolePermissions] = useState(() => {
    const initialData = {};
    const allRoles = getAllRoles();

    Object.values(allRoles).forEach((role) => {
      initialData[role.code] = getRolePermissions(role.code);
    });

    return initialData;
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const selectedRole = rolesMap[selectedRoleCode];
  const selectedRolePermissions = rolePermissions[selectedRoleCode] || [];
  const roleCodePreview = makeRoleCode(newRoleCode || newRoleName);

  const hasPermission = (permissionCode) => {
    return selectedRolePermissions.includes(permissionCode);
  };

  const isSelectedRoleLocked = selectedRoleCode === ROLE_CODES.SUPER_ADMIN;

  const isLockedPermission = (permissionCode) => {
    return permissionCode === PERMISSIONS.MANAGE_PERMISSION;
  };

  const canTogglePermission = (permissionCode) => {
    if (!canEdit) return false;
    if (isSelectedRoleLocked) return false;
    if (isLockedPermission(permissionCode)) return false;

    return true;
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewRoleName("");
    setNewRoleCode("");
    setNewRoleDescription("");
  };

  const handleTogglePermission = (permissionCode) => {
    if (!canTogglePermission(permissionCode)) return;

    setRolePermissions((prev) => {
      const currentPermissions = prev[selectedRoleCode] || [];
      const isExisting = currentPermissions.includes(permissionCode);

      const updatedPermissions = isExisting
        ? currentPermissions.filter((item) => item !== permissionCode)
        : [...currentPermissions, permissionCode];

      return {
        ...prev,
        [selectedRoleCode]: updatedPermissions,
      };
    });

    setMessage("");
    setError("");
  };

  const handleCreateRole = (e) => {
    e.preventDefault();

    if (!canEdit) {
      setError("Chỉ Super Admin mới được tạo role mới.");
      return;
    }

    const result = createCustomRole({
      label: newRoleName,
      code: newRoleCode,
      description: newRoleDescription,
    });

    if (!result.success) {
      setError(result.message);
      setMessage("");
      return;
    }

    const updatedRoles = getAllRoles();

    setRolesMap(updatedRoles);
    setRolePermissions((prev) => ({
      ...prev,
      [result.role.code]: [],
    }));

    setSelectedRoleCode(result.role.code);
    closeCreateModal();

    setError("");
    setMessage(`Đã tạo role "${result.role.label}" thành công.`);
  };

  const handleDeleteRole = (roleCode) => {
    if (!canEdit) return;

    const role = rolesMap[roleCode];

    if (!role?.isCustom) {
      setError("Không thể xóa role mặc định của hệ thống.");
      setMessage("");
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa role "${role.label}" không?`,
    );

    if (!confirmDelete) return;

    const result = deleteCustomRole(roleCode);

    if (!result.success) {
      setError(result.message);
      setMessage("");
      return;
    }

    const updatedRoles = getAllRoles();
    setRolesMap(updatedRoles);

    setRolePermissions((prev) => {
      const cloned = { ...prev };
      delete cloned[roleCode];
      return cloned;
    });

    const nextRole =
      Object.values(updatedRoles).find(
        (item) => item.code !== ROLE_CODES.SUPER_ADMIN,
      ) || DEFAULT_ROLES[ROLE_CODES.ADMIN];

    setSelectedRoleCode(nextRole.code);

    setError("");
    setMessage("Đã xóa role thành công.");
  };

  const handleSave = () => {
    if (!canEdit) return;

    const dataToSave = {};

    roles.forEach((role) => {
      if (role.code !== ROLE_CODES.SUPER_ADMIN) {
        dataToSave[role.code] = rolePermissions[role.code] || [];
      }
    });

    saveRolePermissions(dataToSave);

    setError("");
    setMessage("Đã lưu thay đổi phân quyền thành công.");
  };

  const handleResetDefault = () => {
    if (!canEdit) return;

    const confirmReset = window.confirm(
      "Bạn có chắc muốn đưa toàn bộ quyền về mặc định không? Role tự tạo vẫn được giữ lại nhưng quyền sẽ bị reset.",
    );

    if (!confirmReset) return;

    resetRolePermissions();

    const defaultData = {};

    roles.forEach((role) => {
      defaultData[role.code] = role.permissions || [];
    });

    defaultData[ROLE_CODES.SUPER_ADMIN] =
      DEFAULT_ROLES[ROLE_CODES.SUPER_ADMIN].permissions;

    setRolePermissions(defaultData);

    setError("");
    setMessage("Đã reset quyền về mặc định.");
  };

  const countPermissionsByRole = (roleCode) => {
    return rolePermissions[roleCode]?.length || 0;
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50 overflow-y-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin có thể tạo role mới và phân quyền trực tiếp trên giao
            diện.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            disabled={!canEdit}
            className={`px-4 py-2 rounded text-sm ${
              canEdit
                ? "bg-primary text-white cursor-pointer hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Role New
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            disabled={!canEdit}
            className={`px-4 py-2 rounded text-sm border ${
              canEdit
                ? "bg-white text-gray-700 cursor-pointer hover:bg-gray-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Reset Default
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canEdit}
            className={`px-4 py-2 rounded text-sm ${
              canEdit
                ? "bg-primary text-white cursor-pointer hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>

      {!canEdit && (
        <div className="mb-5 bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-sm">
          Chỉ Super Admin mới được tạo role và thay đổi quyền của role.
        </div>
      )}

      {message && (
        <div className="mb-5 bg-green-50 border border-green-100 text-green-600 rounded-lg p-4 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        {/* Role list */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Role List</h2>
              <p className="text-sm text-gray-500 mt-1">
                Chọn role cần phân quyền.
              </p>
            </div>
          </div>

          <div className="p-3 flex flex-col gap-2 max-h-[680px] overflow-y-auto">
            {roles.map((role) => {
              const isActive = selectedRoleCode === role.code;
              const isSuper = role.code === ROLE_CODES.SUPER_ADMIN;

              return (
                <button
                  key={role.code}
                  type="button"
                  onClick={() => setSelectedRoleCode(role.code)}
                  className={`text-left rounded-lg border p-4 transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 bg-white hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {role.label}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{role.code}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {isSuper && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                          LOCKED
                        </span>
                      )}

                      {role.isCustom && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          CUSTOM
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 leading-5">
                    {role.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-primary font-medium">
                      {countPermissionsByRole(role.code)} permissions
                    </p>

                    {role.isCustom && canEdit && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.code);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permission checklist */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-800">
                Permissions for{" "}
                <span className="text-primary">{selectedRole?.label}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedRole?.description}
              </p>
            </div>

            <div className="text-sm bg-primary/5 text-primary px-4 py-2 rounded-lg h-fit">
              {selectedRolePermissions.length} permissions selected
            </div>
          </div>

          {isSelectedRoleLocked && (
            <div className="m-5 bg-orange-50 border border-orange-100 text-orange-600 rounded-lg p-4 text-sm">
              Super Admin là role toàn quyền và bị khóa, không thể chỉnh quyền
              trực tiếp trên giao diện.
            </div>
          )}

          <div className="p-5 space-y-5">
            {PERMISSION_GROUPS.map((group) => (
              <div
                key={group.title}
                className="border border-gray-100 rounded-lg overflow-hidden"
              >
                <div className="bg-primary/5 px-4 py-3">
                  <h3 className="font-semibold text-primary">{group.title}</h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.permissions.map((permission) => {
                    const checked = hasPermission(permission.code);
                    const disabled = !canTogglePermission(permission.code);

                    return (
                      <label
                        key={permission.code}
                        className={`flex items-start gap-4 p-4 ${
                          disabled
                            ? "cursor-not-allowed bg-gray-50/60"
                            : "cursor-pointer hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() =>
                            handleTogglePermission(permission.code)
                          }
                          className="mt-1 scale-125 cursor-pointer disabled:cursor-not-allowed"
                        />

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="font-medium text-gray-800">
                              {permission.label}
                            </p>

                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded w-fit">
                              {permission.code}
                            </span>
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            {permission.description}
                          </p>

                          {permission.code ===
                            PERMISSIONS.MANAGE_PERMISSION && (
                            <p className="text-xs text-orange-500 mt-2">
                              Quyền này chỉ dành cho Super Admin, không cấp cho
                              role khác trên giao diện demo.
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Create New Role
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tạo role mới để phân quyền.
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

            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Role name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="VD: Content X"
                  autoFocus
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Role code{" "}
                  <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  placeholder="VD: content_x"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                />

                {roleCodePreview && (
                  <p className="text-xs text-gray-400 mt-1">
                    Code sẽ lưu:{" "}
                    <span className="text-primary">{roleCodePreview}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Mô tả role này..."
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary h-24 resize-none"
                />
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
