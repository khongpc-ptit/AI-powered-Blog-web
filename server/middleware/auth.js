import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  // Lấy token trực tiếp từ headers (Key trong Postman nên để là "token")
  const token = req.headers.authorization

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized Login Again' })
  }

  try {
    // Giải mã token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)

    // So sánh email đã mã hóa trong token với email Admin trong .env
    if (token_decode !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    next() // Cho phép đi tiếp xuống tầng Feature (Controller)
  } catch (error) {
    res.json({ success: false, message: 'invalid token' })
  }
}

export default auth
