import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Lưu URL ảnh từ ImageKit
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
) // Tự động lưu ngày tạo và cập nhật [2, 3]

const Blog = mongoose.model('Blog', blogSchema)
export default Blog
