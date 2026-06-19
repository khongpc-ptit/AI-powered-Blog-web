import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const UserRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        date_of_birth: formData.date_of_birth,
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.keys(err.errors).forEach((field) => {
          fieldErrors[field] = err.errors[field].msg;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: err.message || "Đăng ký thất bại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex-1">
        <img
          src={assets.gradientBackground}
          alt=""
          className="absolute -top-50 -z-1 opacity-50"
        />
        <Navbar />

        <div className="mx-6 sm:mx-16 xl:mx-32 py-10">
          <div className="max-w-3xl mx-auto bg-white border border-primary/20 shadow-xl shadow-primary/10 rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <p className="inline-block px-4 py-1 mb-4 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                Create Account
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
                Join <span className="text-primary">PTITBlog</span>
              </h1>
              <p className="text-gray-500 mt-2">
                Tạo tài khoản để có thể bình luận và quản lý thông tin cá nhân.
              </p>
            </div>

            {errors.general && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid sm:grid-cols-2 gap-5 text-gray-600"
            >
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Your name"
                  disabled={loading}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  disabled={loading}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  placeholder="At least 6 characters with uppercase, lowercase, number and symbol"
                  disabled={loading}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Confirm password</label>
                <input
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  type="password"
                  required
                  placeholder="Retype password"
                  disabled={loading}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                    errors.confirm_password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Date of birth</label>
                <input
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  required
                  disabled={loading}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                    errors.date_of_birth ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 rounded-lg bg-primary py-3 font-medium text-white cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserRegister;
