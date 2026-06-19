import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_USER_MESSAGES } from '~/constants/messages'
import { AdminUpdateUserReqBody } from '~/models/requests/UserAdminPage.requests'

class AdminUserService {
  async getAllUsersAdmin({
    page = 1,
    limit = 10,
    search = ''
  }: {
    page?: number
    limit?: number
    search?: string
  }) {
    const matchCondition: any = {}

    if (search) {
      matchCondition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      databaseService.users
        .find(matchCondition)
        .project({ password: 0 })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.users.countDocuments(matchCondition)
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        total_items: total
      }
    }
  }

  async updateUser(id: string, payload: AdminUpdateUserReqBody) {
    const updateData: any = { updated_at: new Date() }

    if (payload.name) updateData.name = payload.name
    if (payload.email) {
      // Kiểm tra email trùng lặp (trừ chính user đang update)
      const existingUser = await databaseService.users.findOne({
        email: payload.email,
        _id: { $ne: new ObjectId(id) }
      })
      if (existingUser) {
        throw new errorWithStatus({
          message: ADMIN_USER_MESSAGES.EMAIL_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
      updateData.email = payload.email
    }
    if (payload.date_of_birth) updateData.date_of_birth = new Date(payload.date_of_birth)
    if (payload.location !== undefined) updateData.location = payload.location
    if (payload.role_id) {
      // Kiểm tra role có tồn tại không
      const role = await databaseService.roles.findOne({ _id: new ObjectId(payload.role_id) })
      if (!role) {
        throw new errorWithStatus({
          message: ADMIN_USER_MESSAGES.ROLE_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      updateData.role_id = new ObjectId(payload.role_id)
    }

    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!user) {
      throw new errorWithStatus({
        message: ADMIN_USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }

  async deleteUser(id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )

    if (!user) {
      throw new errorWithStatus({
        message: ADMIN_USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Xóa user
    await databaseService.users.deleteOne({ _id: new ObjectId(id) })
    // Xóa refresh token liên quan
    await databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(id) })

    return user
  }
}

const adminUserService = new AdminUserService()
export default adminUserService
