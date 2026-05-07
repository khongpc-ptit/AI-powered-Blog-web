import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    blog:{type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true}, // Tham chiếu đến Blog
    name: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Trạng thái duyệt bình luận
}, { timestamps: true }); // Tự động lưu ngày tạo và cập nhật 

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;