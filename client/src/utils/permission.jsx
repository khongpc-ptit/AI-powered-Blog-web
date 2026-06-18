import { ADMIN_ROLE_CODES, DEFAULT_ROLES, ROLE_CODES } from "../constants/rbac";

const ROLE_PERMISSION_STORAGE_KEY = "rolePermissions";

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

export const getRolePermissions = (roleCode) => {
  const normalizedRole = normalizeRoleCode(roleCode);

  if (!DEFAULT_ROLES[normalizedRole]) {
    return [];
  }

  if (normalizedRole === ROLE_CODES.SUPER_ADMIN) {
    return DEFAULT_ROLES[ROLE_CODES.SUPER_ADMIN].permissions;
  }

  const storedPermissions = getStoredRolePermissions();

  if (Array.isArray(storedPermissions[normalizedRole])) {
    return storedPermissions[normalizedRole];
  }

  return DEFAULT_ROLES[normalizedRole].permissions;
};

export const getRoleByCode = (roleCode) => {
  const normalizedRole = normalizeRoleCode(roleCode);
  const defaultRole = DEFAULT_ROLES[normalizedRole];

  if (!defaultRole) return null;

  return {
    ...defaultRole,
    permissions: getRolePermissions(normalizedRole),
  };
};

export const getCurrentUser = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user"));

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

  return ADMIN_ROLE_CODES.includes(normalizedRole);
};

export const isSuperAdmin = (user) => {
  if (!user || !user.role) return false;

  return normalizeRoleCode(user.role) === ROLE_CODES.SUPER_ADMIN;
};
