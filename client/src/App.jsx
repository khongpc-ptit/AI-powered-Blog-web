import React from "react";
import { Routes, Route } from "react-router-dom";
import "quill/dist/quill.snow.css";

import Home from "./pages/Home";
import Blog from "./pages/Blog";

import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserProfile from "./pages/user/UserProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedPermissionRoute from "./components/ProtectedPermissionRoute";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import AccountAdmin from "./pages/admin/AccountAdmin";
import Permissions from "./pages/admin/Permissions";

import { PERMISSIONS } from "./constants/rbac";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/blogs/:id" element={<Blog />} />

      {/* Auth routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

      {/* User protected route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin protected routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="addBlog"
            element={
              <ProtectedPermissionRoute permissions={[PERMISSIONS.CREATE_POST]}>
                <AddBlog />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="listBlog"
            element={
              <ProtectedPermissionRoute
                permissions={[
                  PERMISSIONS.UPDATE_POST,
                  PERMISSIONS.DELETE_POST,
                  PERMISSIONS.CHANGE_POST_STATUS,
                ]}
              >
                <ListBlog />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="comments"
            element={
              <ProtectedPermissionRoute
                permissions={[PERMISSIONS.DELETE_COMMENT]}
              >
                <Comments />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="categories"
            element={
              <ProtectedPermissionRoute
                permissions={[
                  PERMISSIONS.CREATE_CATEGORY,
                  PERMISSIONS.UPDATE_CATEGORY,
                  PERMISSIONS.DELETE_CATEGORY,
                ]}
              >
                <Categories />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="users"
            element={
              <ProtectedPermissionRoute
                permissions={[PERMISSIONS.UPDATE_USER, PERMISSIONS.DELETE_USER]}
              >
                <Users />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="accountadmin"
            element={
              <ProtectedPermissionRoute
                permissions={[PERMISSIONS.MANAGE_ADMIN]}
              >
                <AccountAdmin />
              </ProtectedPermissionRoute>
            }
          />

          <Route
            path="permissions"
            element={
              <ProtectedPermissionRoute
                permissions={[PERMISSIONS.MANAGE_PERMISSION]}
              >
                <Permissions />
              </ProtectedPermissionRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
