import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessAny } from "../utils/permission";

const ProtectedPermissionRoute = ({ children, permissions = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  const accessToken = localStorage.getItem("accessToken");
  const adminToken = localStorage.getItem("ptitblog_admin_token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdmin = localStorage.getItem("isAdmin");

  const localUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const currentUser = user || localUser;

  const hasToken = !!accessToken || !!adminToken;
  const loggedIn = isAuthenticated || isLoggedIn === "true";

  if (!hasToken || !loggedIn) {
    return <Navigate to="/adminlogin" replace />;
  }

  // Backend đã check permission thật rồi.
  // Frontend chỉ cần admin login là cho vào trang.
  if (isAdmin === "true") {
    return children;
  }

  const userWithRole = currentUser
    ? {
        ...currentUser,
        role: currentUser.role || currentUser.role_id,
      }
    : null;

  if (!canAccessAny(userWithRole, permissions)) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
};

export default ProtectedPermissionRoute;
