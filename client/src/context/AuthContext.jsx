import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, accessToken } = response.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, accessToken } = response.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  }, [navigate]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await fetch("http://localhost:5000/api/blogs/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      const data = await response.json();
      const updatedUser = data.data;
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, message: error.message || "Cập nhật thất bại" };
    }
  }, []);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      const response = await fetch("http://localhost:5000/api/blogs/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đổi mật khẩu thất bại");
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || "Đổi mật khẩu thất bại" };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      setUser,
    }),
    [user, loading, login, register, logout, updateProfile, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;
