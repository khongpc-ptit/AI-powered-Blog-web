import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Comment from '~/models/schemas/Comment.schema'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { BLOG_MESSAGES } from '~/constants/messages'


class BlogService {
  async getAllCategories() {
    // Lấy tất cả danh mục (có thể lọc theo trạng thái nếu schema có thêm thuộc tính này)
    const categories = await databaseService.categories.find({}).toArray()
    return categories
  }

  async getAllBlogs({
    page = 1,
    limit = 10,
    search = '',
    category = '',
    sort_by = 'created_at',
    order = 'desc'
  }: {
    page?: number
    limit?: number
    search?: string
    category?: string
    sort_by?: string
    order?: string
  }) {
    const matchCondition: any = { isPublished: true } // Chỉ lấy bài viết đã xuất bản

    if (search) {
      matchCondition.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) {
      matchCondition.category_id = new ObjectId(category)
    }

    const sortCondition: any = {
      [sort_by]: order === 'asc' ? 1 : -1
    }

    const skip = (page - 1) * limit

    const [blogs, total] = await Promise.all([
      databaseService.blogs
        .find(matchCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.blogs.countDocuments(matchCondition)
    ])

    return {
      blogs,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        total_items: total
      }
    }
  }

  async getBlogById(id: string) {
    // Cập nhật views + 1 và trả về document mới
    const blog = await databaseService.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) as any }, // Ép kiểu vì schema bạn đang để string
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
    if (!blog) {
      throw new errorWithStatus({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return blog
  }


  async getBlogComments({
    blog_id,
    page = 1,
    limit = 10
  }: {
    blog_id: string
    page?: number
    limit?: number
  }) {
    const skip = (page - 1) * limit
    // Không lọc is_approved nếu bạn chưa triển khai, nhưng nếu có thì thêm is_approved: true
    const matchCondition = { blog_id: new ObjectId(blog_id) }

    const [comments, total] = await Promise.all([
      databaseService.comments
        .find(matchCondition)
        .sort({ created_at: -1 }) // Mới nhất lên đầu
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.comments.countDocuments(matchCondition)
    ])

    return {
      comments,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        total_items: total
      }
    }
  }

  async addComment({ blog_id, user_id, name, content }: { blog_id: string; user_id: string; name: string; content: string }) {
    const newComment = new Comment({
      blog_id: new ObjectId(blog_id),
      user_id: user_id,
      name: name,
      content: content,
      is_approved: true
    })
    const result = await databaseService.comments.insertOne(newComment)
    newComment._id = result.insertedId
    return newComment
  }
}

const blogService = new BlogService()
export default blogService
