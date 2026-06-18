import express from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { addCommentValidator } from '~/middlewares/blog.middlewares'
import {
  getAllCategoriesController,
  getAllBlogsController,
  getBlogByIdController,
  getBlogCommentsController,
  addCommentController
} from '~/controllers/blog.controllers'

const blogRouter = express.Router()




blogRouter.get('/categories', wrapRequestHandler(getAllCategoriesController))
blogRouter.get('/', wrapRequestHandler(getAllBlogsController))
blogRouter.get('/:id', wrapRequestHandler(getBlogByIdController))
blogRouter.get('/:id/comments', wrapRequestHandler(getBlogCommentsController))


blogRouter.post(
  '/:id/comments',
  accessTokenValidator,
  addCommentValidator,
  wrapRequestHandler(addCommentController)
)

export default blogRouter

