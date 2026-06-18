import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/assets";

const UserProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    date_of_birth: user?.date_of_birth || "",
    location: user?.location || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
    setErrors({});
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setErrors({});

    try {
      await updateProfile(profileForm);
      setMessage("Cập nhật thông tin tài khoản thành công.");
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.keys(err.errors).forEach((field) => {
          fieldErrors[field] = err.errors[field].msg;
        });
        setErrors(fieldErrors);
        setError("Vui lòng kiểm tra lại thông tin.");
      } else {
        setError(err.message || "Cập nhật thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrors({ confirm_password: "Mật khẩu mới nhập lại không khớp." });
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setErrors({});

    try {
      await changePassword({
        password: passwordForm.password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password,
      });
      setPasswordForm({
        password: "",
        new_password: "",
        confirm_password: "",
      });
      setMessage("Đổi mật khẩu thành công.");
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.keys(err.errors).forEach((field) => {
          fieldErrors[field] = err.errors[field].msg;
        });
        setErrors(fieldErrors);
      } else {
        setError(err.message || "Đổi mật khẩu thất bại.");
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
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 rounded-2xl bg-white border border-primary/15 shadow-xl shadow-primary/10 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium">
                      My Account
                    </p>
                    <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800">
                      {user?.name}
                    </h1>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="flex rounded-full border border-primary/20 bg-primary/5 p-1 text-sm">
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setError("");
                      setMessage("");
                      setErrors({});
                    }}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                      activeTab === "profile"
                        ? "bg-primary text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("password");
                      setError("");
                      setMessage("");
                      setErrors({});
                    }}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                      activeTab === "password"
                        ? "bg-primary text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <p className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {message}
              </p>
            )}

            {error && (
              <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {activeTab === "profile" ? (
              <form
                onSubmit={handleUpdateProfile}
                className="bg-white border border-primary/15 shadow rounded-2xl p-6 sm:p-8 grid sm:grid-cols-2 gap-5 text-gray-600"
              >
                <div className="sm:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Contact information
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    Xem và cập nhật thông tin liên hệ của tài khoản.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    type="text"
                    required
                    disabled={loading}
                    className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    name="email"
                    value={user?.email || ""}
                    type="email"
                    disabled
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-400 outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Email không thể thay đổi.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Date of birth</label>
                  <input
                    name="date_of_birth"
                    value={profileForm.date_of_birth}
                    onChange={handleProfileChange}
                    type="date"
                    disabled={loading}
                    className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                      errors.date_of_birth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.date_of_birth && (
                    <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    type="text"
                    disabled={loading}
                    placeholder="Your location"
                    className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-500">{errors.location}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="sm:col-span-2 sm:w-48 rounded-lg bg-primary py-3 font-medium text-white cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleChangePassword}
                className="bg-white border border-primary/15 shadow rounded-2xl p-6 sm:p-8 max-w-2xl text-gray-600"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Change password
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Cập nhật mật khẩu mới cho tài khoản của bạn.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium">
                      Current password
                    </label>
                    <input
                      name="password"
                      value={passwordForm.password}
                      onChange={handlePasswordChange}
                      type="password"
                      required
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
                    <label className="text-sm font-medium">New password</label>
                    <input
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      type="password"
                      required
                      disabled={loading}
                      placeholder="At least 6 characters with uppercase, lowercase, number and symbol"
                      className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                        errors.new_password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.new_password && (
                      <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Confirm new password
                    </label>
                    <input
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      type="password"
                      required
                      disabled={loading}
                      className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary ${
                        errors.confirm_password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-48 rounded-lg bg-primary py-3 font-medium text-white cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60"
                  >
                    {loading ? "Updating..." : "Change password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
