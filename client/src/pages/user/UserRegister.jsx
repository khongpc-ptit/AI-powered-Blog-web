import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const currentYear = new Date().getFullYear();

const UserRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    yearOfBirth: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, yearOfBirth, address, phone, name, email, password } = formData;
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        yearOfBirth: yearOfBirth || undefined,
        address: address?.trim() || undefined,
        phone: phone?.trim() || undefined,
      });

      if (result.success) {
        navigate("/profile", { replace: true });
      } else {
        setError(result.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
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

            {error && (
              <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
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
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
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
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Confirm password</label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  required
                  minLength={6}
                  placeholder="Retype password"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Year of birth</label>
                <input
                  name="yearOfBirth"
                  value={formData.yearOfBirth}
                  onChange={handleChange}
                  type="number"
                  min="1900"
                  max={currentYear}
                  placeholder="2004"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Your phone number"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your address"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                />
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
