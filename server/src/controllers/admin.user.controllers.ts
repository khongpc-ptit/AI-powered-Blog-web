import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_USER_MESSAGES } from '~/constants/messages'
import { GetAllUsersReqQuery, AdminUpdateUserReqBody } from '~/models/requests/UserAdminPage.requests'
import adminUserService from '~/services/admin.user.services'

export const getAllUsersController = async (
  req: Request<ParamsDictionary, any, any, GetAllUsersReqQuery>,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = req.query.search as string

  const result = await adminUserService.getAllUsersAdmin({ page, limit, search })

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_USER_MESSAGES.GET_ALL_USERS_SUCCESS,
    result: result.users,
    pagination: result.pagination
  })
}

export const updateUserInfoByAdminController = async (
  req: Request<ParamsDictionary, any, AdminUpdateUserReqBody>,
  res: Response
) => {
  const { id } = req.params as { id: string }
  const payload = req.body

  const user = await adminUserService.updateUser(id, payload)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_USER_MESSAGES.UPDATE_USER_SUCCESS,
    result: user
  })
}

export const deleteUserByAdminController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const user = await adminUserService.deleteUser(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_USER_MESSAGES.DELETE_USER_SUCCESS,
    result: user
  })
}
