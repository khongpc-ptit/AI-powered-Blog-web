import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_ROLE_CODES } from "../constants/rbac";

const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user?.role || user?.role_id || "";
  const normalizedRoleCode = normalizeRoleCode(normalizedRole);

  if (!ADMIN_ROLE_CODES.includes(normalizedRoleCode)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const normalizeRoleCode = (roleCode) => {
  if (!roleCode) return "";

  const role = String(roleCode).trim().toLowerCase();

  if (role === "superadmin" || role === "super_admin" || role === "super-admin") {
    return "super_admin";
  }
  if (role === "admin") return "admin";
  if (role === "contentmanager" || role === "content_manager" || role === "content-manager") {
    return "content_manager";
  }
  if (role === "blogger") return "blogger";

  return role;
};

export default AdminProtectedRoute;
