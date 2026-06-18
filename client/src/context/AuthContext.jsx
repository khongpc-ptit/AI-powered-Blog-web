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
    saveTokens({
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    });
    await refreshUserProfile();
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
    const data = await userApi.changePassword({ password, new_password, confirm_password });
    return data;
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
