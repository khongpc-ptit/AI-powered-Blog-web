import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "ptitblog_users";
const CURRENT_USER_KEY = "ptitblog_current_user";

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Cannot read ${key} from localStorage`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removePassword = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = readJson(CURRENT_USER_KEY, null);
    if (savedUser) setUser(savedUser);
  }, []);

  const register = async ({ name, email, password, yearOfBirth, address, phone }) => {
    const users = readJson(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error("Email này đã được đăng ký.");
    }

    const newUser = {
      _id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: normalizedEmail,
      password,
      yearOfBirth: yearOfBirth || "",
      address: address?.trim() || "",
      phone: phone?.trim() || "",
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    writeJson(USERS_KEY, nextUsers);

    const safeUser = removePassword(newUser);
    setUser(safeUser);
    writeJson(CURRENT_USER_KEY, safeUser);
    return safeUser;
  };

  const login = async ({ email, password }) => {
    const users = readJson(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (item) => item.email === normalizedEmail && item.password === password
    );

    if (!foundUser) {
      throw new Error("Email hoặc mật khẩu không đúng.");
    }

    const safeUser = removePassword(foundUser);
    setUser(safeUser);
    writeJson(CURRENT_USER_KEY, safeUser);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (payload) => {
    if (!user) throw new Error("Bạn cần đăng nhập để cập nhật tài khoản.");

    const users = readJson(USERS_KEY, []);
    const nextUsers = users.map((item) =>
      item._id === user._id
        ? {
            ...item,
            name: payload.name.trim(),
            yearOfBirth: payload.yearOfBirth || "",
            address: payload.address.trim(),
            phone: payload.phone.trim(),
          }
        : item
    );

    const updatedUser = removePassword(nextUsers.find((item) => item._id === user._id));
    writeJson(USERS_KEY, nextUsers);
    writeJson(CURRENT_USER_KEY, updatedUser);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user) throw new Error("Bạn cần đăng nhập để đổi mật khẩu.");

    const users = readJson(USERS_KEY, []);
    const currentUser = users.find((item) => item._id === user._id);

    if (!currentUser || currentUser.password !== currentPassword) {
      throw new Error("Mật khẩu hiện tại không đúng.");
    }

    const nextUsers = users.map((item) =>
      item._id === user._id ? { ...item, password: newPassword } : item
    );

    writeJson(USERS_KEY, nextUsers);
    return true;
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), register, login, logout, updateProfile, changePassword }),
    [user]
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
