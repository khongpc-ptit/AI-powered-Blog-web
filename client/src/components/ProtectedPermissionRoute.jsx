import React from "react";
import { Navigate } from "react-router-dom";
import { canAccessAny, getCurrentUser } from "../utils/permission";

const ProtectedPermissionRoute = ({ children, permission, permissions }) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const requiredPermissions = permissions || (permission ? [permission] : []);

  if (!canAccessAny(currentUser, requiredPermissions)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedPermissionRoute;
