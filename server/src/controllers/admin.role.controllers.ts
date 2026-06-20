import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_ROLE_MESSAGES } from '~/constants/messages'
import { CreateRoleReqBody, UpdateRolePermissionsReqBody } from '~/models/requests/Role.requests'
import adminRoleService from '~/services/admin.role.services'

export const getAllPermissionsController = async (req: Request, res: Response) => {
  const permissions = await adminRoleService.getAllPermissions()

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_ROLE_MESSAGES.GET_ALL_PERMISSIONS_SUCCESS,
    result: permissions
  })
}

export const getAllRolesController = async (req: Request, res: Response) => {
  const roles = await adminRoleService.getAllRoles()

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_ROLE_MESSAGES.GET_ALL_ROLES_SUCCESS,
    result: roles
  })
}

export const createRoleController = async (
  req: Request<ParamsDictionary, any, CreateRoleReqBody>,
  res: Response
) => {
  const payload = req.body

  const role = await adminRoleService.createRole(payload)

  return res.status(HTTP_STATUS.CREATED).json({
    message: ADMIN_ROLE_MESSAGES.CREATE_ROLE_SUCCESS,
    result: role
  })
}

export const updateRolePermissionsController = async (
  req: Request<ParamsDictionary, any, UpdateRolePermissionsReqBody>,
  res: Response
) => {
  const { id } = req.params as { id: string }
  const payload = req.body

  const role = await adminRoleService.updateRolePermissions(id, payload)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_ROLE_MESSAGES.UPDATE_ROLE_PERMISSIONS_SUCCESS,
    result: role
  })
}

export const deleteRoleController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const role = await adminRoleService.deleteRole(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_ROLE_MESSAGES.DELETE_ROLE_SUCCESS,
    result: role
  })
}
