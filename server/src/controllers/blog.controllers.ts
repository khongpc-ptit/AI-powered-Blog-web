import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import blogService from '~/services/blog.services'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { BLOG_MESSAGES } from '~/constants/messages'

export const getAllCategoriesController = async (req: Request, res: Response) => {
  const categories = await blogService.getAllCategories()
  return res.status(HTTP_STATUS.OK).json({
    message: BLOG_MESSAGES.GET_CATEGORIES_SUCCESS,
    result: categories
  })
}

export const getAllBlogsController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = req.query.search as string
  const category = req.query.category as string
  const sort_by = req.query.sort_by as string || 'created_at'
  const order = req.query.order as string || 'desc'

  const result = await blogService.getAllBlogs({ page, limit, search, category, sort_by, order })
  
  return res.status(HTTP_STATUS.OK).json({
    message: BLOG_MESSAGES.GET_BLOGS_SUCCESS,
    result: result.blogs,
    pagination: result.pagination
  })
}

export const getBlogByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const blog = await blogService.getBlogById(id as string)

  return res.status(HTTP_STATUS.OK).json({
    message: BLOG_MESSAGES.GET_BLOG_SUCCESS,
    result: blog
  })
}

export const getBlogCommentsController = async (req: Request, res: Response) => {
  const { id } = req.params
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const result = await blogService.getBlogComments({ blog_id: id as string, page, limit })

  return res.status(HTTP_STATUS.OK).json({
    message: BLOG_MESSAGES.GET_COMMENTS_SUCCESS,
    result: result.comments,
    pagination: result.pagination
  })
}

export const addCommentController = async (req: Request, res: Response) => {
  const { id } = req.params // blog id
  const { content } = req.body
  const user_id = req.decoded_authorization?.user_id as string
  
  // Lấy name từ user collection để gán vào comment
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  const name = user?.name || 'Anonymous'

  const comment = await blogService.addComment({ blog_id: id as string, user_id, name, content })

  return res.status(HTTP_STATUS.CREATED).json({
    message: BLOG_MESSAGES.ADD_COMMENT_SUCCESS,
    result: comment
  })
}
