import React, { useMemo, useState } from "react";
import {
  DEFAULT_ROLES,
  PERMISSION_GROUPS,
  PERMISSIONS,
  ROLE_CODES,
} from "../../constants/rbac";
import {
  getCurrentUser,
  getRolePermissions,
  isSuperAdmin,
  resetRolePermissions,
  saveRolePermissions,
} from "../../utils/permission";

const Permissions = () => {
  const currentUser = getCurrentUser();
  const canEdit = isSuperAdmin(currentUser);

  const roles = useMemo(() => Object.values(DEFAULT_ROLES), []);

  const editableRoles = useMemo(
    () => roles.filter((role) => role.code !== ROLE_CODES.SUPER_ADMIN),
    [roles],
  );

  const [selectedRoleCode, setSelectedRoleCode] = useState(
    editableRoles[0]?.code || ROLE_CODES.ADMIN,
  );

  const [rolePermissions, setRolePermissions] = useState(() => {
    const initialData = {};

    roles.forEach((role) => {
      initialData[role.code] = getRolePermissions(role.code);
    });

    return initialData;
  });

  const [message, setMessage] = useState("");

  const selectedRole = DEFAULT_ROLES[selectedRoleCode];

  const selectedRolePermissions = rolePermissions[selectedRoleCode] || [];

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
  };

  const handleSave = () => {
    const dataToSave = {};

    roles.forEach((role) => {
      if (role.code !== ROLE_CODES.SUPER_ADMIN) {
        dataToSave[role.code] = rolePermissions[role.code] || [];
      }
    });

    saveRolePermissions(dataToSave);

    setMessage("Đã lưu thay đổi phân quyền thành công.");
  };

  const handleResetDefault = () => {
    const confirmReset = window.confirm(
      "Bạn có chắc muốn đưa toàn bộ quyền về mặc định không?",
    );

    if (!confirmReset) return;

    resetRolePermissions();

    const defaultData = {};

    roles.forEach((role) => {
      defaultData[role.code] = DEFAULT_ROLES[role.code].permissions;
    });

    setRolePermissions(defaultData);
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
        </div>

        <div className="flex gap-3">
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
          Chỉ Super Admin mới được thay đổi quyền của các role.
        </div>
      )}

      {message && (
        <div className="mb-5 bg-green-50 border border-green-100 text-green-600 rounded-lg p-4 text-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* LEFT: Role list */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Role List</h2>
            <p className="text-sm text-gray-500 mt-1">
              Chọn role cần phân quyền.
            </p>
          </div>

          <div className="p-3 flex flex-col gap-2 max-h-[650px] overflow-y-auto">
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

                    {isSuper && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                        LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-3 leading-5">
                    {role.description}
                  </p>

                  <p className="text-xs text-primary mt-3 font-medium">
                    {countPermissionsByRole(role.code)} permissions
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Permission checklist */}
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
                              Quyền này chỉ dành cho Super Admin
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

      <div className="mt-6 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg p-4 text-sm"></div>
    </div>
  );
};

export default Permissions;
