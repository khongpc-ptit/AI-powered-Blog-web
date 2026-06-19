import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import { authApi, saveTokens, userApi } from "../services/auth.api";

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login({
        email: email.trim(),
        password,
      });

      console.log("Login response:", data);

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

      if (accessToken && refreshToken) {
        saveTokens({
          accessToken,
          refreshToken,
        });
      }

      let currentUser = null;

      try {
        const profileRes = await userApi.getProfile();
        currentUser = profileRes.result || profileRes.user || profileRes.data;
      } catch (profileError) {
        console.log(
          "Cannot get profile, use login response instead:",
          profileError,
        );

        currentUser =
          data.result?.user ||
          data.user ||
          data.result?.user_info ||
          data.result ||
          null;
      }

      if (!currentUser) {
        currentUser = {
          name: email.split("@")[0],
          email: email.trim(),
          role: "user",
          type: "user",
        };
      }

      const role =
        currentUser.role?.name ||
        currentUser.role?.role_name ||
        currentUser.role_name ||
        currentUser.role ||
        "user";

      const userType =
        role === "admin" ||
        role === "super_admin" ||
        role === "content_manager" ||
        role === "blogger"
          ? "admin"
          : "user";

      const userToSave = {
        id: currentUser._id || currentUser.id || currentUser.user_id || "",
        name: currentUser.name || email.split("@")[0],
        email: currentUser.email || email.trim(),
        role,
        type: userType,
      };

      localStorage.setItem("currentUser", JSON.stringify(userToSave));
      localStorage.setItem("user", JSON.stringify(userToSave));
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("isAdmin", userType === "admin" ? "true" : "false");

      if (userType === "admin") {
        localStorage.setItem(
          "ptitblog_admin_token",
          accessToken || "admin_token",
        );
      } else {
        localStorage.removeItem("ptitblog_admin_token");
      }

      // Login xong luôn về trang chủ và reload để Navbar/AuthContext cập nhật user
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
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
              <span className="text-primary">Login</span> Account
            </h1>
            <p className="font-light text-gray-500 mt-2">
              Login to comment on blogs or access admin dashboard
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
                placeholder="Your email"
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
                  placeholder="Your password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserLogin;
