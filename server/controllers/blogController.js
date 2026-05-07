import Blog from "../models/Blog.js";
import imagekit from "../configs/imageKit.js";
import fs from 'fs';

export const addBlog = async (req, res) => {
    try {
        const { title, subtitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Tải ảnh lên ImageKit 
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        // Tối ưu hóa ảnh thông qua URL Transformation (Nén auto, định dạng WebP, rộng 1280px) [10-12]
        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "1280" }
            ]
        });

        // Lưu vào MongoDB [5]
        await Blog.create({
            title, subtitle, description, category, isPublished,
            image: optimizedImageURL
        });

        res.json({ success: true, message: "Blog added successfully" }); [5]
    } catch (error) {
        res.json({ success: false, message: error.message }); [13]
    }
};
// Lấy danh sách tất cả bài viết đã xuất bản (dành cho người dùng)
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }); // Chỉ lấy bài viết có isPublished là true [1]
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Lấy chi tiết một bài viết theo ID
export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params; // Lấy ID từ URL parameter [5]
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//  Xóa bài viết theo ID (Bảo mật: Chỉ Admin)
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body; // Nhận ID từ body của yêu cầu 
        
        await Blog.findByIdAndDelete(id);
        
        // Xóa tất cả bình luận liên quan đến bài viết này 
        await Comment.deleteMany({ blog: id });
        
        res.json({ success: true, message: "blog deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái Xuất bản/Chưa xuất bản (Toggle Publish)
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        
        // Đảo ngược trạng thái isPublished [6, 7]
        blog.isPublished = !blog.isPublished;
        await blog.save();
        
        res.json({ success: true, message: "blog status updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { blog, name, email, content } = req.body;  
        await Comment.create({ blog, name, content }); // Lưu bình luận với tham chiếu đến Blog 
        res.json({ success: true, message: "Comment added for review" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getBlogComments = async (req, res) => {
        console.log("Chay toi day roi ne")
    try {
        const { blogId } = req.body;  
        const comments = await Comment.find({ Blog: blogId, isApproved: true }).sort({ createdAt: -1 }); // Chỉ lấy bình luận đã được duyệt
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }  
}; 