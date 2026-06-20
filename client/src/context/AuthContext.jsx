import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authApi, userApi, saveTokens, getRefreshToken, clearTokens } from "../services/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const data = await userApi.getProfile();
          setUser(data.result);
        } catch (error) {
          clearTokens();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const refreshUserProfile = useCallback(async () => {
    try {
      const data = await userApi.getProfile();
      setUser(data.result);
      return data.result;
    } catch (error) {
      logout();
      throw error;
    }
  }, []);

  const register = async ({ name, email, password, confirm_password, date_of_birth }) => {
    const data = await authApi.register({ name, email, password, confirm_password, date_of_birth });
    return data;
  };

  const login = async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    saveTokens({
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    });
    await refreshUserProfile();
    return data;
  };

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const updateProfile = async (payload) => {
    const data = await userApi.updateProfile(payload);
    setUser(data.result);
    return data.result;
  };

  const changePassword = async ({ password, new_password, confirm_password }) => {
    if (!password) {
      throw { message: "Mật khẩu cũ không được để trống.", errors: { password: { msg: "Old password is required" } } };
    }
    if (password.length < 6 || password.length > 50) {
      throw { message: "Mật khẩu cũ phải từ 6 đến 50 ký tự.", errors: { password: { msg: "Password must be between 6 and 50 characters" } } };
    }
    if (!new_password) {
      throw { message: "Mật khẩu mới không được để trống.", errors: { new_password: { msg: "Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol" } } };
    }
    if (new_password.length < 6 || new_password.length > 50) {
      throw { message: "Mật khẩu mới phải từ 6 đến 50 ký tự.", errors: { new_password: { msg: "Password must be between 6 and 50 characters" } } };
    }
    if (new_password !== confirm_password) {
      throw { message: "Mật khẩu mới không khớp.", errors: { confirm_password: { msg: "Confirm password must match password" } } };
    }

    try {
      const data = await userApi.changePassword({ password, new_password, confirm_password });
      return data;
    } catch (error) {
      if (error.status === 400 && error.message === "Old password is incorrect") {
        throw { message: "Mật khẩu cũ không đúng.", errors: { password: { msg: "Old password is incorrect" } } };
      }
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
      refreshUserProfile,
    }),
    [user, loading, logout, refreshUserProfile]
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
