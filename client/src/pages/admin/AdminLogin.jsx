import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { authApi, saveTokens, userApi } from "../../services/auth.api";

const ADMIN_DASHBOARD_PATH = "/admin";

const adminRoles = ["admin", "super_admin", "content_manager", "blogger"];

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRole = (user) => {
    return (
      user?.role?.name ||
      user?.role?.role_name ||
      user?.role_name ||
      user?.role ||
      "user"
    );
  };

  const clearLoginData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("ptitblog_admin_token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login({
        email: email.trim(),
        password,
      });

      console.log("Admin login response:", data);

      const accessToken =
        data.result?.access_token ||
        data.result?.accessToken ||
        data.access_token ||
        data.accessToken;

      const refreshToken =
        data.result?.refresh_token ||
        data.result?.refreshToken ||
        data.refresh_token ||
        data.refreshToken;

      if (!accessToken || !refreshToken) {
        setError("Không nhận được token đăng nhập.");
        return;
      }

      saveTokens({
        accessToken,
        refreshToken,
      });

      let currentUser = null;

      try {
        const profileRes = await userApi.getProfile();
        currentUser = profileRes.result || profileRes.user || profileRes.data;
      } catch (profileError) {
        console.log("Cannot get profile, use login response:", profileError);

        currentUser =
          data.result?.user ||
          data.user ||
          data.result?.user_info ||
          data.result ||
          null;
      }

      if (!currentUser) {
        setError("Không lấy được thông tin tài khoản.");
        clearLoginData();
        return;
      }

      const role = getRole(currentUser);

      if (!adminRoles.includes(role)) {
        clearLoginData();
        setError("Tài khoản này không có quyền truy cập trang admin.");
        return;
      }

      const userToSave = {
        id: currentUser._id || currentUser.id || currentUser.user_id || "",
        name: currentUser.name || email.split("@")[0],
        email: currentUser.email || email.trim(),
        role,
        type: "admin",
      };

      localStorage.setItem("currentUser", JSON.stringify(userToSave));
      localStorage.setItem("user", JSON.stringify(userToSave));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("ptitblog_admin_token", accessToken);

      window.location.href = ADMIN_DASHBOARD_PATH;
    } catch (err) {
      console.error("Admin login failed:", err);
      setError(err.message || "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />

      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h1>
            <p className="font-light text-gray-500 mt-2">
              Login to access admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full text-gray-600">
            <div className="flex flex-col">
              <label>Email:</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Admin email"
                className="border-b-2 border-gray-300 outline-none mb-6 py-2 focus:border-primary"
              />
            </div>

            <div className="flex flex-col">
              <label>Password:</label>

              <div className="relative mb-4">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Admin password"
                  className="w-full border-b-2 border-gray-300 outline-none py-2 pr-16 focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-primary cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login Admin"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            User login?{" "}
            <Link to="/login" className="text-primary font-medium">
              Go to user login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
