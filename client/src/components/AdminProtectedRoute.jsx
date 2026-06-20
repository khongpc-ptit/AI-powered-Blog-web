import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isValidJwt = (token) => {
  return (
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.split(".").length === 3
  );
};

const AdminProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("isAdmin");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const hasValidToken = isValidJwt(accessToken);

  console.log("ADMIN_PROTECTED_CHECK:", {
    accessToken,
    isAdmin,
    isLoggedIn,
    hasValidToken,
  });

  if (!hasValidToken || isLoggedIn !== "true") {
    console.log(
      "ADMIN_PROTECTED_REDIRECT: /adminlogin - missing valid token/login",
    );
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
