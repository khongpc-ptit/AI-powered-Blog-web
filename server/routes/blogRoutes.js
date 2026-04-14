import express from 'express';
import { addBlog,getAllBlogs,getBlogById, deleteBlogById, togglePublish } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js'; // Middleware bảo mật [16, 17]

const blogRouter = express.Router();

// Sử dụng upload.single('image') để nhận file ảnh từ client [15]
blogRouter.post('/add', upload.single('image'), auth, addBlog); 
blogRouter.get('/all', getAllBlogs); // Lấy tất cả bài viết đã xuất bản [1]
blogRouter.get('/:blogId', getBlogById); // Lấy chi tiết bài viết theo ID [5]
blogRouter.post('delete/', auth, deleteBlogById); // Xóa bài viết theo ID (chỉ admin) [17]
blogRouter.post('/toggle-publish', auth, togglePublish); // Cập nhật trạng thái Xuất bản/Chưa xuất bản (chỉ admin) [17]
export default blogRouter;