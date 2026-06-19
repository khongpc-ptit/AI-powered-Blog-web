import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import {
  CreateBlogReqBody,
  UpdateBlogReqBody,
  GetAllBlogsReqQuery,
  GenerateBlogContentReqBody
} from '~/models/requests/Blog.requests'
import adminBlogService from '~/services/admin.blog.services'
import generateBlogContentAI from '~/utils/ai.utils'
import { ADMIN_BLOG_MESSAGES } from '~/constants/messages'
import { error } from 'node:console'
import { errorWithStatus } from '~/models/Error'

export const getAllBlogsAdminController = async (
  req: Request<ParamsDictionary, any, any, GetAllBlogsReqQuery>,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = req.query.search as string

  const result = await adminBlogService.getAllBlogsAdmin({ page, limit, search })

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.GET_ALL_BLOGS_SUCCESS,
    result: result.blogs,
    pagination: result.pagination
  })
}

export const addBlogController = async (req: Request<ParamsDictionary, any, CreateBlogReqBody>, res: Response) => {
  const payload = req.body
  // Nếu có file ảnh upload, file path sẽ lưu vào req.file
  if (req.file) {
    // Lưu tạm theo cấu trúc local của express
    payload.image = `/uploads/${req.file.filename}`
  }

  const blog = await adminBlogService.addBlog(payload)

  return res.status(HTTP_STATUS.CREATED).json({
    message: ADMIN_BLOG_MESSAGES.CREATE_BLOG_SUCCESS,
    result: blog
  })
}

export const updateBlogController = async (req: Request<ParamsDictionary, any, UpdateBlogReqBody>, res: Response) => {
  const { id } = req.params as { id: string }
  const payload = req.body

  if (req.file) {
    payload.image = `/uploads/${req.file.filename}`
  }

  const blog = await adminBlogService.updateBlog(id, payload)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.UPDATE_BLOG_SUCCESS,
    result: blog
  })
}

export const togglePublishController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const blog = await adminBlogService.togglePublish(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.TOGGLE_PUBLISH_SUCCESS,
    result: blog
  })
}

export const getBlogByIdController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const blog = await adminBlogService.getBlogById(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.GET_ALL_BLOGS_SUCCESS,
    result: blog
  })
}

export const deleteBlogByIdController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const blog = await adminBlogService.deleteBlogById(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.DELETE_BLOG_SUCCESS,
    result: blog
  })
}

export const generateContentController = async (
  req: Request<ParamsDictionary, any, GenerateBlogContentReqBody>,
  res: Response
) => {
  const { prompt } = req.body

  if (!prompt) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ADMIN_BLOG_MESSAGES.PROMPT_REQUIRED
    })
  }
  try {
    const generatedContent = await generateBlogContentAI(
      prompt + 'Hãy viết một blog post siêu ngắn 150 từ về chủ đề này với format nội dung như một bài blog thông thường'
    )
    return res.status(HTTP_STATUS.OK).json({
      message: ADMIN_BLOG_MESSAGES.GENERATE_CONTENT_SUCCESS,
      result: generatedContent
    })
  } catch {
    throw new errorWithStatus({
      message: 'Generate fail',
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR
    })
  }
}
