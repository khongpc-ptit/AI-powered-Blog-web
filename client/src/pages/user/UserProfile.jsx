import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/assets";

const currentYear = new Date().getFullYear();

const UserProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    yearOfBirth: user?.yearOfBirth || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setMessage("Cập nhật thông tin tài khoản thành công.");
      } else {
        setError(result.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      setError(err.message || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới nhập lại không khớp.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (result.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setMessage("Đổi mật khẩu thành công.");
      } else {
        setError(result.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại.");
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

            {(message || error) && (
              <p
                className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
                  message
                    ? "border-green-200 bg-green-50 text-green-600"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message || error}
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

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Full name</label>
                  <input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    type="text"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
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
                  <label className="text-sm font-medium">Year of birth</label>
                  <input
                    name="yearOfBirth"
                    value={profileForm.yearOfBirth}
                    onChange={handleProfileChange}
                    type="number"
                    min="1900"
                    max={currentYear}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    type="tel"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    type="text"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                  />
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
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      type="password"
                      required
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">New password</label>
                    <input
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      type="password"
                      required
                      minLength={6}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Confirm new password
                    </label>
                    <input
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      type="password"
                      required
                      minLength={6}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                    />
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
