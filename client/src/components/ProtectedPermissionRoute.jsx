import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessAny } from "../utils/permission";

const ProtectedPermissionRoute = ({ children, permission, permissions }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userWithRole = {
    ...user,
    role: user.role || user.role_id,
  };

  const requiredPermissions = permissions || (permission ? [permission] : []);

  if (!canAccessAny(userWithRole, requiredPermissions)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedPermissionRoute;
