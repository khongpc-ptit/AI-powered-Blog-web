import { ADMIN_ROLE_CODES, DEFAULT_ROLES, ROLE_CODES } from "../constants/rbac";

const ROLE_PERMISSION_STORAGE_KEY = "rolePermissions";
const CUSTOM_ROLES_STORAGE_KEY = "customRoles";

export const normalizeRoleCode = (roleCode) => {
  if (!roleCode) return "";

  const role = String(roleCode).trim().toLowerCase();

  if (
    role === "superadmin" ||
    role === "super_admin" ||
    role === "super-admin"
  ) {
    return ROLE_CODES.SUPER_ADMIN;
  }

  if (role === "admin") {
    return ROLE_CODES.ADMIN;
  }

  if (
    role === "contentmanager" ||
    role === "content_manager" ||
    role === "content-manager"
  ) {
    return ROLE_CODES.CONTENT_MANAGER;
  }

  if (role === "blogger") {
    return ROLE_CODES.BLOGGER;
  }

  return role;
};

export const makeRoleCode = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

export const getStoredRolePermissions = () => {
  try {
    const data = JSON.parse(localStorage.getItem(ROLE_PERMISSION_STORAGE_KEY));
    return data || {};
  } catch (error) {
    return {};
  }
};

export const saveRolePermissions = (rolePermissions) => {
  localStorage.setItem(
    ROLE_PERMISSION_STORAGE_KEY,
    JSON.stringify(rolePermissions),
  );

  window.dispatchEvent(new Event("rolePermissionsUpdated"));
};

export const resetRolePermissions = () => {
  localStorage.removeItem(ROLE_PERMISSION_STORAGE_KEY);
  window.dispatchEvent(new Event("rolePermissionsUpdated"));
};

export const getStoredCustomRoles = () => {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_ROLES_STORAGE_KEY));
    return data || {};
  } catch (error) {
    return {};
  }
};

export const saveCustomRoles = (customRoles) => {
  localStorage.setItem(CUSTOM_ROLES_STORAGE_KEY, JSON.stringify(customRoles));
  window.dispatchEvent(new Event("customRolesUpdated"));
};

export const getAllRoles = () => {
  return {
    ...DEFAULT_ROLES,
    ...getStoredCustomRoles(),
  };
};

export const createCustomRole = ({ label, code, description }) => {
  const roleLabel = String(label || "").trim();
  const roleCode = makeRoleCode(code || label);

  if (!roleLabel) {
    return {
      success: false,
      message: "Vui lòng nhập tên role.",
    };
  }

  if (!roleCode) {
    return {
      success: false,
      message: "Mã role không hợp lệ.",
    };
  }

  const allRoles = getAllRoles();

  if (allRoles[roleCode]) {
    return {
      success: false,
      message: "Role này đã tồn tại.",
    };
  }

  const newRole = {
    code: roleCode,
    label: roleLabel,
    description:
      String(description || "").trim() || "Role được tạo bởi Super Admin.",
    permissions: [],
    isCustom: true,
  };

  const customRoles = getStoredCustomRoles();

  saveCustomRoles({
    ...customRoles,
    [roleCode]: newRole,
  });

  const rolePermissions = getStoredRolePermissions();

  saveRolePermissions({
    ...rolePermissions,
    [roleCode]: [],
  });

  return {
    success: true,
    role: newRole,
  };
};

export const deleteCustomRole = (roleCode) => {
  const normalizedRole = normalizeRoleCode(roleCode);

  const customRoles = getStoredCustomRoles();

  if (!customRoles[normalizedRole]) {
    return {
      success: false,
      message: "Chỉ có thể xóa role được tạo thêm.",
    };
  }

  delete customRoles[normalizedRole];
  saveCustomRoles(customRoles);

  const rolePermissions = getStoredRolePermissions();
  delete rolePermissions[normalizedRole];
  saveRolePermissions(rolePermissions);

  return {
    success: true,
  };
};

export const getRolePermissions = (roleCode) => {
  const normalizedRole = normalizeRoleCode(roleCode);
  const allRoles = getAllRoles();

  if (!allRoles[normalizedRole]) {
    return [];
  }

  if (normalizedRole === ROLE_CODES.SUPER_ADMIN) {
    return DEFAULT_ROLES[ROLE_CODES.SUPER_ADMIN].permissions;
  }

  const storedPermissions = getStoredRolePermissions();

  if (Array.isArray(storedPermissions[normalizedRole])) {
    return storedPermissions[normalizedRole];
  }

  return allRoles[normalizedRole].permissions || [];
};

export const getRoleByCode = (roleCode) => {
  const normalizedRole = normalizeRoleCode(roleCode);
  const allRoles = getAllRoles();
  const role = allRoles[normalizedRole];

  if (!role) return null;

  return {
    ...role,
    permissions: getRolePermissions(normalizedRole),
  };
};

export const getCurrentUser = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return null;

    return {
      ...currentUser,
      role: normalizeRoleCode(currentUser.role),
    };
  } catch (error) {
    return null;
  }
};

export const hasPermission = (user, permissionCode) => {
  if (!user || !user.role) return false;

  const role = getRoleByCode(user.role);

  if (!role) return false;

  return role.permissions.includes(permissionCode);
};

export const canAccessAny = (user, permissions = []) => {
  if (!permissions || permissions.length === 0) return true;

  return permissions.some((permission) => hasPermission(user, permission));
};

export const isAdminRole = (user) => {
  if (!user || !user.role) return false;

  const normalizedRole = normalizeRoleCode(user.role);
  const customRoles = getStoredCustomRoles();

  return (
    ADMIN_ROLE_CODES.includes(normalizedRole) ||
    Boolean(customRoles[normalizedRole])
  );
};

export const isSuperAdmin = (user) => {
  if (!user || !user.role) return false;

  return normalizeRoleCode(user.role) === ROLE_CODES.SUPER_ADMIN;
};

export const getRoleOptionsForAdminAccounts = () => {
  const allRoles = getAllRoles();

  return Object.values(allRoles)
    .filter((role) => role.code !== ROLE_CODES.SUPER_ADMIN)
    .map((role) => ({
      code: role.code,
      label: role.label,
    }));
};
