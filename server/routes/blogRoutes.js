import express from 'express';
import { addBlog,getAllBlogs,getBlogById, deleteBlogById, togglePublish, getBlogComments,addComment } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js'; 

// /api/admin
const blogRouter = express.Router();

// Sử dụng upload.single('image') để nhận file ảnh từ client 
blogRouter.post('/add', upload.single('image'), auth, addBlog); 
blogRouter.get('/all', getAllBlogs); // Lấy tất cả bài viết đã xuất bản 
blogRouter.get('/:blogId', getBlogById); // Lấy chi tiết bài viết theo ID 
blogRouter.post('delete/', auth, deleteBlogById); // Xóa bài viết theo ID (chỉ admin) 
blogRouter.post('/toggle-publish', auth, togglePublish); // Cập nhật trạng thái Xuất bản/Chưa xuất bản (chỉ admin) 
blogRouter.post('/add-comment', addComment); // Thêm bình luận vào bài viết 
blogRouter.post('/comments',getBlogComments)
export default blogRouter;