import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const demoAccounts = [
  {
    id: "super-001",
    name: "Super Admin",
    email: "superadmin@gmail.com",
    password: "123456",
    role: "super_admin",
    type: "admin",
  },
  {
    id: "admin-001",
    name: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    role: "admin",
    type: "admin",
  },
  {
    id: "content-001",
    name: "Content Manager",
    email: "content@gmail.com",
    password: "123456",
    role: "content_manager",
    type: "admin",
  },
  {
    id: "blogger-001",
    name: "Blogger",
    email: "blogger@gmail.com",
    password: "123456",
    role: "blogger",
    type: "admin",
  },
];

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const account = demoAccounts.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    );

    if (!account) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    const currentUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      type: account.type,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("isLoggedIn", "true");

    if (account.type === "admin") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("ptitblog_admin_token", "mock_admin_token");
      navigate("/admin");
      return;
    }

    localStorage.setItem("isAdmin", "false");
    localStorage.removeItem("ptitblog_admin_token");
    navigate(redirectPath === "/" ? "/profile" : redirectPath);
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
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Register
            </Link>
          </p>

          <div className="mt-6 text-xs text-gray-500 bg-gray-50 border rounded p-3 leading-6">
            <p className="font-medium text-gray-700 mb-1">Demo accounts:</p>
            <p>Super Admin: superadmin@gmail.com / 123456</p>
            <p>Admin: admin@gmail.com / 123456</p>
            <p>Content Manager: content@gmail.com / 123456</p>
            <p>Blogger: blogger@gmail.com / 123456</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserLogin;
