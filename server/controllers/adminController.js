import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
// Hàm xử lý đăng nhập Admin
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // So sánh email và mật khẩu với dữ liệu trong .env
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'invalid credentials' })
    }

    // Nếu khớp, tạo mã token bằng JWT
    const token = jwt.sign(email, process.env.JWT_SECRET)

    // Trả về token cho frontend
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }) // Lấy tất cả bài viết, bao gồm cả đã xuất bản và chưa xuất bản
    res.json({ success: true, blogs })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 }) // Lấy tất cả bình luận và thông tin tiêu đề bài viết liên quan
    res.json({ success: true, comments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
export const getDashboard = async (req, res) => {
  try {
    const blogs = await Blog.countDocuments() // Tổng số bài viết
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5) // 5 bài viết mới nhất
    const comments = await Comment.countDocuments() // Tổng số bình luận
    const drafts = await Blog.countDocuments({ isPublished: false }) // Số bài viết chưa xuất bản
    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs
    }
    res.json({ success: true, dashboardData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.body
    await Comment.findByIdAndDelete(commentId)
    res.json({ success: true, message: 'Comment deleted successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
export const approveCommentById = async (req, res) => {
  try {
    const { commentId } = req.body
    await Comment.findByIdAndUpdate(commentId, { isApproved: true })
    res.json({ success: true, message: 'Comment approved successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
