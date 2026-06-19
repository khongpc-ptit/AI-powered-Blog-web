import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const adminToken = localStorage.getItem("ptitblog_admin_token");
  const isAdmin = localStorage.getItem("isAdmin");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  console.log("ADMIN_PROTECTED_CHECK:", {
    accessToken,
    adminToken,
    isAdmin,
    isLoggedIn,
  });

  const hasToken = !!accessToken || !!adminToken;

  if (!hasToken || isLoggedIn !== "true") {
    console.log("ADMIN_PROTECTED_REDIRECT: /adminlogin - missing token/login");
    return <Navigate to="/adminlogin" replace />;
  }

  if (isAdmin !== "true") {
    console.log("ADMIN_PROTECTED_REDIRECT: /adminlogin - not admin");
    return <Navigate to="/adminlogin" replace />;
  }

  console.log("ADMIN_PROTECTED_ALLOW: /admin");
  return <Outlet />;
};

export default AdminProtectedRoute;
