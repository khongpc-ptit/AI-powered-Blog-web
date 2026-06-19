import { Request, Response, NextFunction } from 'express'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { PERMISSION_MESSAGES } from '~/constants/messages'

export const requirePermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // accessTokenValidator đã gắn decoded_authorization vào req
      const decoded_authorization = (req as Request).decoded_authorization
      const { user_id } = decoded_authorization as { user_id: string }

      // Tìm user để lấy role_id
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
      if (!user || !user.role_id) {
        throw new errorWithStatus({
          message: PERMISSION_MESSAGES.ROLE_NOT_FOUND,
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      // Tìm role dựa trên role_id
      const role = await databaseService.roles.findOne({ _id: user.role_id })
      if (!role) {
        throw new errorWithStatus({
          message: PERMISSION_MESSAGES.ROLE_NOT_FOUND,
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      // Kiểm tra xem quyền có tồn tại trong mảng permissions của role không (mảng string)
      if (!role.permissions || role.permissions.length === 0) {
        throw new errorWithStatus({
          message: PERMISSION_MESSAGES.INSUFFICIENT_PERMISSIONS,
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      const hasPermission = role.permissions.includes(permissionCode.toUpperCase())
      
      if (!hasPermission) {
        throw new errorWithStatus({
          message: PERMISSION_MESSAGES.INSUFFICIENT_PERMISSIONS,
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
