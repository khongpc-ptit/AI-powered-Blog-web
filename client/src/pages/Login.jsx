import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        const user = result.user;
        
        if (user.role === "admin" || user.role === "super_admin" || 
            user.role === "content_manager" || user.role === "blogger") {
          navigate("/admin");
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(result.message || "Email hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi đăng nhập");
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

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder="Your password"
                className="border-b-2 border-gray-300 outline-none mb-6 py-2 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60"
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
