import React, { useState, useEffect } from "react";
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
import { permissionService } from "../../services/admin.service";

const roleOrder = [
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.ADMIN,
  ROLE_CODES.CONTENT_MANAGER,
  ROLE_CODES.BLOGGER,
];

const editableRoles = [
  ROLE_CODES.ADMIN,
  ROLE_CODES.CONTENT_MANAGER,
  ROLE_CODES.BLOGGER,
];

const Permissions = () => {
  const currentUser = getCurrentUser();
  const [rolePermissions, setRolePermissions] = useState(() => {
    const initialData = {};
    roleOrder.forEach((roleCode) => {
      initialData[roleCode] = getRolePermissions(roleCode);
    });
    return initialData;
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const [permissionsRes, rolesRes] = await Promise.all([
        permissionService.getAll(),
        permissionService.getRoles(),
      ]);
      
      if (rolesRes.data) {
        rolesRes.data.forEach((role) => {
          if (role.permissions && Array.isArray(role.permissions)) {
            setRolePermissions((prev) => ({
              ...prev,
              [role.code]: role.permissions,
            }));
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const canEdit = isSuperAdmin(currentUser);

  const hasPermission = (roleCode, permissionCode) => {
    return rolePermissions[roleCode]?.includes(permissionCode);
  };

  const isLockedPermission = (permissionCode) => {
    return permissionCode === PERMISSIONS.MANAGE_PERMISSION;
  };

  const canTogglePermission = (roleCode, permissionCode) => {
    if (!canEdit) return false;
    if (!editableRoles.includes(roleCode)) return false;
    if (isLockedPermission(permissionCode)) return false;
    return true;
  };

  const handleTogglePermission = (roleCode, permissionCode) => {
    if (!canTogglePermission(roleCode, permissionCode)) return;

    setRolePermissions((prev) => {
      const currentPermissions = prev[roleCode] || [];
      const isExisting = currentPermissions.includes(permissionCode);
      const updatedPermissions = isExisting
        ? currentPermissions.filter((item) => item !== permissionCode)
        : [...currentPermissions, permissionCode];

      return {
        ...prev,
        [roleCode]: updatedPermissions,
      };
    });

    setMessage("");
  };

  const handleSave = async () => {
    try {
      const updatePromises = editableRoles.map(async (roleCode) => {
        const permissions = rolePermissions[roleCode] || [];
        try {
          await permissionService.updateRolePermissions(roleCode, permissions);
        } catch (error) {
          console.error(`Failed to update permissions for ${roleCode}:`, error);
        }
      });

      await Promise.all(updatePromises);

      saveRolePermissions({
        [ROLE_CODES.ADMIN]: rolePermissions[ROLE_CODES.ADMIN] || [],
        [ROLE_CODES.CONTENT_MANAGER]: rolePermissions[ROLE_CODES.CONTENT_MANAGER] || [],
        [ROLE_CODES.BLOGGER]: rolePermissions[ROLE_CODES.BLOGGER] || [],
      });

      setMessage("Đã lưu thay đổi phân quyền thành công.");
    } catch (error) {
      console.error("Failed to save permissions:", error);
      setMessage("Lưu thay đổi thất bại. Vui lòng thử lại.");
    }
  };

  const handleResetDefault = () => {
    const confirmReset = window.confirm(
      "Bạn có chắc muốn đưa toàn bộ quyền về mặc định không?"
    );

    if (!confirmReset) return;

    resetRolePermissions();

    const defaultData = {};
    roleOrder.forEach((roleCode) => {
      defaultData[roleCode] = DEFAULT_ROLES[roleCode].permissions;
    });

    setRolePermissions(defaultData);
    setMessage("Đã reset quyền về mặc định.");
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-10 bg-blue-50/50 overflow-y-auto flex items-center justify-center">
        <p className="text-gray-500">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin có thể tick/bỏ tick quyền cho từng role trong hệ thống.
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {roleOrder.map((roleCode) => {
          const role = DEFAULT_ROLES[roleCode];

          return (
            <div
              key={role.code}
              className={`bg-white p-4 rounded-lg shadow border ${
                role.code === ROLE_CODES.SUPER_ADMIN
                  ? "border-primary/40"
                  : "border-gray-100"
              }`}
            >
              <h2 className="font-semibold text-gray-800">{role.label}</h2>
              <p className="text-xs text-gray-500 mt-2 leading-5">
                {role.description}
              </p>
              <p className="text-xs text-primary mt-3 font-medium">
                {rolePermissions[roleCode]?.length || 0} permissions
              </p>

              {role.code === ROLE_CODES.SUPER_ADMIN && (
                <p className="text-xs text-orange-500 mt-2">
                  Role này bị khóa, không được chỉnh quyền.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Permission Matrix</h2>
          <p className="text-sm text-gray-500">
            Tick vào ô để cấp quyền, bỏ tick để thu hồi quyền.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 text-left min-w-72">Permission</th>
                <th className="px-5 py-4 text-center">Super Admin</th>
                <th className="px-5 py-4 text-center">Admin</th>
                <th className="px-5 py-4 text-center">Content Manager</th>
                <th className="px-5 py-4 text-center">Blogger</th>
              </tr>
            </thead>

            <tbody>
              {PERMISSION_GROUPS.map((group) => (
                <React.Fragment key={group.title}>
                  <tr className="bg-primary/5">
                    <td
                      colSpan="5"
                      className="px-5 py-3 font-semibold text-primary"
                    >
                      {group.title}
                    </td>
                  </tr>

                  {group.permissions.map((permission) => (
                    <tr
                      key={permission.code}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {permission.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {permission.code}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {permission.description}
                        </p>

                        {permission.code === PERMISSIONS.MANAGE_PERMISSION && (
                          <p className="text-xs text-orange-500 mt-1">
                            Quyền này chỉ dành cho Super Admin.
                          </p>
                        )}
                      </td>

                      {roleOrder.map((roleCode) => {
                        const checked = hasPermission(
                          roleCode,
                          permission.code
                        );

                        const disabled = !canTogglePermission(
                          roleCode,
                          permission.code
                        );

                        return (
                          <td key={roleCode} className="px-5 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() =>
                                handleTogglePermission(
                                  roleCode,
                                  permission.code
                                )
                              }
                              className={`scale-125 ${
                                disabled
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
