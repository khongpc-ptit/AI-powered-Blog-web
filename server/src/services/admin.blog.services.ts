import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Blog from '~/models/schemas/Blog.schema'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_BLOG_MESSAGES } from '~/constants/messages'


class AdminBlogService {
  async getAllBlogsAdmin({
    page = 1,
    limit = 10,
    search = ''
  }: {
    page?: number
    limit?: number
    search?: string
  }) {
    const matchCondition: any = {}

    if (search) {
      matchCondition.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [blogs, total] = await Promise.all([
      databaseService.blogs
        .find(matchCondition)
        .project({description: 0})
        .sort({ created_at: -1 })
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

  async addBlog(payload: any) {
    const newBlog = new Blog({
      title: payload.title,
      subtitle: payload.subtitle,
      description: payload.description,
      category_id: new ObjectId(payload.category_id),
      image: payload.image,
      isPublished: payload.isPublished === 'true' || payload.isPublished === true
    })

    const result = await databaseService.blogs.insertOne(newBlog)
    newBlog._id = result.insertedId
    return newBlog
  }

  async updateBlog(id: string, payload: any) {
    const updateData: any = {}
    if (payload.title) updateData.title = payload.title
    if (payload.subtitle) updateData.subtitle = payload.subtitle
    if (payload.description) updateData.description = payload.description
    if (payload.category_id) updateData.category_id = new ObjectId(payload.category_id)
    if (payload.image) updateData.image = payload.image
    if (payload.isPublished !== undefined) {
      updateData.isPublished = payload.isPublished === 'true' || payload.isPublished === true
    }
    updateData.updated_at = new Date()

    const blog = await databaseService.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!blog) {
      throw new errorWithStatus({
        message: ADMIN_BLOG_MESSAGES.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return blog
  }

  async togglePublish(id: string) {
    const blog = await databaseService.blogs.findOne({ _id: new ObjectId(id) })
    if (!blog) {
      throw new errorWithStatus({
        message: ADMIN_BLOG_MESSAGES.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const updatedBlog = await databaseService.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isPublished: !blog.isPublished, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    return updatedBlog
  }
}

const adminBlogService = new AdminBlogService()
export default adminBlogService
