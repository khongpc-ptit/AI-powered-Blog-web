import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAdminRole } from "../utils/permission";

const AdminProtectedRoute = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminRole(currentUser)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
