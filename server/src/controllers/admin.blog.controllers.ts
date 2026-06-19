import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import adminBlogService from '~/services/admin.blog.services'
import { generateBlogContentAI } from '~/utils/ai.utils'
import { ADMIN_BLOG_MESSAGES } from '~/constants/messages'


export const getAllBlogsAdmin = async (req: Request, res: Response) => {
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

export const addBlog = async (req: Request, res: Response) => {
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

export const updateBlog = async (req: Request, res: Response) => {
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

export const togglePublish = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }

  const blog = await adminBlogService.togglePublish(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.TOGGLE_PUBLISH_SUCCESS,
    result: blog
  })
}

export const generateContent = async (req: Request, res: Response) => {
  const { prompt } = req.body

  if (!prompt) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ADMIN_BLOG_MESSAGES.PROMPT_REQUIRED
    })
  }

  const generatedContent = await generateBlogContentAI(prompt)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_BLOG_MESSAGES.GENERATE_CONTENT_SUCCESS,
    result: generatedContent
  })
}
