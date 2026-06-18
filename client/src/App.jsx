import React from "react";
import { Routes, Route } from "react-router-dom";

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
import Login from "./components/admin/Login";
import "quill/dist/quill.snow.css";
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
          <Route path="listBlog" element={<ListBlog />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
