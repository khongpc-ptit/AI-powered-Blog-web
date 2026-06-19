import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_STAFF_MESSAGES } from '~/constants/messages'
import { GetAllAdminsReqQuery, CreateAdminReqBody, ResetAdminPasswordReqBody } from '~/models/requests/Staff.requests'
import adminStaffService from '~/services/admin.staff.services'

export const getAllAdminsController = async (
  req: Request<ParamsDictionary, any, any, GetAllAdminsReqQuery>,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = req.query.search as string

  const result = await adminStaffService.getAllAdmins({ page, limit, search })

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_STAFF_MESSAGES.GET_ALL_ADMINS_SUCCESS,
    result: result.staffs,
    pagination: result.pagination
  })
}

export const createAdminAccountController = async (
  req: Request<ParamsDictionary, any, CreateAdminReqBody>,
  res: Response
) => {
  const payload = req.body

  const staff = await adminStaffService.createAdminAccount(payload)

  return res.status(HTTP_STATUS.CREATED).json({
    message: ADMIN_STAFF_MESSAGES.CREATE_ADMIN_SUCCESS,
    result: staff
  })
}

export const resetAdminPasswordController = async (
  req: Request<ParamsDictionary, any, ResetAdminPasswordReqBody>,
  res: Response
) => {
  const { id } = req.params as { id: string }
  const payload = req.body

  const staff = await adminStaffService.resetAdminPassword(id, payload)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_STAFF_MESSAGES.RESET_PASSWORD_SUCCESS,
    result: staff
  })
}

export const deleteAdminAccountController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const staff = await adminStaffService.deleteAdminAccount(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_STAFF_MESSAGES.DELETE_ADMIN_SUCCESS,
    result: staff
  })
}
