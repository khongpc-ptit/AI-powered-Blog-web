import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { GetAllCommentsReqQuery } from '~/models/requests/Comment.requests'
import adminCommentService from '~/services/admin.comment.services'
import { ADMIN_COMMENT_MESSAGES } from '~/constants/messages'

export const getAllCommentsController = async (
  req: Request<ParamsDictionary, any, any, GetAllCommentsReqQuery>,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = req.query.search as string
  const is_approved = req.query.is_approved as string

  const result = await adminCommentService.getAllComments({ page, limit, search, is_approved })

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_COMMENT_MESSAGES.GET_ALL_COMMENTS_SUCCESS,
    result: result.comments,
    pagination: result.pagination
  })
}

export const approveCommentByIdController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const comment = await adminCommentService.approveCommentById(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_COMMENT_MESSAGES.APPROVE_COMMENT_SUCCESS,
    result: comment
  })
}

export const deleteCommentByIdController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const comment = await adminCommentService.deleteCommentById(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_COMMENT_MESSAGES.DELETE_COMMENT_SUCCESS,
    result: comment
  })
}
