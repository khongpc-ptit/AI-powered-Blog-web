import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { authApi } from "../../services/auth.api";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setResendMessage("Không tìm thấy địa chỉ email. Vui lòng thử đăng ký lại.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setResendMessage("");
    try {
      const data = await authApi.resendVerificationEmail(email);
      setSuccess(true);
      setResendMessage(data.message || "Email xác thực đã được gửi lại!");
    } catch (err) {
      setSuccess(false);
      setResendMessage(err.message || "Không thể gửi lại email. Vui lòng thử lại sau.");
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
          className="absolute -top-50 -z-1 opacity-50 w-full"
        />
        <Navbar />

        <div className="mx-6 sm:mx-16 xl:mx-32 py-16 flex justify-center items-center">
          <div className="max-w-md w-full bg-white border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-8 sm:p-10 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Kiểm tra email của bạn
            </h1>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Chúng tôi đã gửi link xác thực tài khoản đến địa chỉ email:
              {email && (
                <span className="block font-semibold text-primary mt-1 text-base">
                  {email}
                </span>
              )}
            </p>

            <p className="text-gray-500 text-xs mb-8">
              Vui lòng nhấp vào liên kết trong email để kích hoạt tài khoản của bạn.
              Đừng quên kiểm tra cả hộp thư <strong>Spam (Thư rác)</strong> nếu không tìm thấy.
            </p>

            {resendMessage && (
              <div
                className={`mb-6 p-4 rounded-xl border text-sm transition-all duration-300 ${
                  success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                {resendMessage}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/95 transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi lại email xác thực"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all cursor-pointer"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckEmail;
