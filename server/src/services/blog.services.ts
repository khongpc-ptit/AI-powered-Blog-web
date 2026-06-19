import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Comment from '~/models/schemas/Comment.schema'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { BLOG_MESSAGES } from '~/constants/messages'


class BlogService {
  async getAllCategories() {
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
    const matchCondition: any = { isPublished: true }

    if (search) {
      matchCondition.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) {
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(category)
      if (isValidObjectId) {
        matchCondition.category_id = new ObjectId(category)
      } else {
        const categoryDoc = await databaseService.categories.findOne({ name: category })
        if (categoryDoc) {
          matchCondition.category_id = categoryDoc._id
        } else {
          return {
            blogs: [],
            pagination: {
              page,
              limit,
              total_pages: 0,
              total_items: 0
            }
          }
        }
      }
    }

    const sortCondition: any = {
      [sort_by]: order === 'asc' ? 1 : -1
    }

    const skip = (page - 1) * limit

    // Sử dụng aggregation để join với categories và lấy category name
    const categoriesCollectionName = process.env.DB_CATEGORIES_COLLECTION || 'categories'

    const [blogs, total] = await Promise.all([
      databaseService.blogs.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: categoriesCollectionName,
            localField: 'category_id',
            foreignField: '_id',
            as: 'categoryData'
          }
        },
        {
          $addFields: {
            category: { $ifNull: [{ $arrayElemAt: ['$categoryData.name', 0] }, 'General'] },
            content: '$description'
          }
        },
        {
          $project: { categoryData: 0 }
        },
        { $sort: sortCondition },
        { $skip: skip },
        { $limit: limit }
      ]).toArray(),
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
    // Validate ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      throw new errorWithStatus({
        message: 'Invalid blog ID',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const categoriesCollectionName = process.env.DB_CATEGORIES_COLLECTION || 'categories'

    // Sử dụng aggregation để join với categories
    const blog = await databaseService.blogs.aggregate([
      { $match: { _id: new ObjectId(id), isPublished: true } },
      {
        $lookup: {
          from: categoriesCollectionName,
          localField: 'category_id',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $addFields: {
          category: { $ifNull: [{ $arrayElemAt: ['$categoryData.name', 0] }, 'General'] },
          content: '$description'
        }
      },
      {
        $project: { categoryData: 0 }
      }
    ]).toArray()

    if (!blog || blog.length === 0) {
      throw new errorWithStatus({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Increment views
    await databaseService.blogs.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    )

    return { ...blog[0], views: (blog[0].views || 0) + 1 }
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
    // Validate ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(blog_id)) {
      return {
        comments: [],
        pagination: {
          page,
          limit,
          total_pages: 0,
          total_items: 0
        }
      }
    }

    const skip = (page - 1) * limit
    const matchCondition = { blog_id: new ObjectId(blog_id), is_approved: true }

    const [comments, total] = await Promise.all([
      databaseService.comments
        .find(matchCondition)
        .sort({ created_at: -1 })
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
    // Validate ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(blog_id)) {
      throw new errorWithStatus({
        message: 'Invalid blog ID',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newComment = new Comment({
      blog_id: new ObjectId(blog_id),
      user_id: user_id,
      name: name,
      content: content,
      is_approved: false
    })
    const result = await databaseService.comments.insertOne(newComment)
    newComment._id = result.insertedId
    return newComment
  }
}

const blogService = new BlogService()
export default blogService
