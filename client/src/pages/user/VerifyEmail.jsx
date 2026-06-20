import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { authApi } from "../../services/auth.api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Đang tiến hành xác thực tài khoản của bạn...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setSuccess(false);
        setMessage("Không tìm thấy mã token xác thực.");
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setSuccess(true);
        setMessage(response.message || "Xác thực email thành công!");
      } catch (error) {
        setSuccess(false);
        setMessage(error.message || "Đường dẫn xác thực không hợp lệ hoặc đã hết hạn.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

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
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Đang xác thực
                </h1>
                <p className="text-gray-500 text-sm">{message}</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                  Thành công!
                </h1>
                <p className="text-emerald-600 font-medium mb-6">{message}</p>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và trải nghiệm toàn bộ các tính năng của PTITBlog.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/95 transition-all cursor-pointer shadow-md shadow-primary/10"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                  Xác thực thất bại
                </h1>
                <p className="text-rose-600 font-medium mb-6">{message}</p>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Có vẻ như đường dẫn xác thực tài khoản của bạn đã hết hạn (24 giờ) hoặc không đúng cấu trúc. Vui lòng đăng ký lại hoặc gửi lại email xác thực.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/95 transition-all cursor-pointer shadow-md shadow-primary/10"
                  >
                    Đăng ký tài khoản mới
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Quay lại trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
