import express from 'express'
import { adminLogin } from '../controllers/adminController.js'
import {
  getAllBlogsAdmin,
  getAllComments,
  deleteCommentById,
  approveCommentById,
  getDashboard
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
const adminRouter = express.Router()

// Định nghĩa route POST cho login /api/admin
adminRouter.post('/login', adminLogin)
adminRouter.get('/blogs', auth, getAllBlogsAdmin) // Lấy tất cả bài viết (dành cho admin)
adminRouter.get('/comments', auth, getAllComments)
adminRouter.post('/delete-comment', auth, deleteCommentById)
adminRouter.post('/approve-comment', auth, approveCommentById)
adminRouter.get('/dashboard', auth, getDashboard)

export default adminRouter
