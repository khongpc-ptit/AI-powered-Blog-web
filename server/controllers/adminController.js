import jwt from 'jsonwebtoken';

// Hàm xử lý đăng nhập Admin
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // So sánh email và mật khẩu với dữ liệu trong .env
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "invalid credentials" });
        }

        // Nếu khớp, tạo mã token bằng JWT
        const token = jwt.sign(email, process.env.JWT_SECRET);

        // Trả về token cho frontend
        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};