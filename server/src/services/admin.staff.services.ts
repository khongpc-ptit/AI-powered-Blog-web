import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_STAFF_MESSAGES } from '~/constants/messages'
import { CreateAdminReqBody, ResetAdminPasswordReqBody } from '~/models/requests/Staff.requests'
import { passwordHash } from '~/utils/bcrypt'
import User from '~/models/schemas/User.schema'

class AdminStaffService {
  async getAllAdmins({
    page = 1,
    limit = 10,
    search = ''
  }: {
    page?: number
    limit?: number
    search?: string
  }) {
    // Tìm Role 'USER' mặc định
    const defaultRole = await databaseService.roles.findOne({ name: 'USER' })
    
    const matchCondition: any = {}

    // Lọc ra các user KHÔNG PHẢI là 'USER' thường (tức là staff/admin)
    if (defaultRole) {
      matchCondition.role_id = { $ne: defaultRole._id }
    } else {
      // Nếu không có role USER, giả định tất cả user có role_id đều là staff
      matchCondition.role_id = { $exists: true }
    }

    if (search) {
      matchCondition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [staffs, total] = await Promise.all([
      databaseService.users
        .aggregate([
          { $match: matchCondition },
          {
            $lookup: {
              from: process.env.DB_ROLES_COLLECTION as string,
              localField: 'role_id',
              foreignField: '_id',
              as: 'role_info'
            }
          },
          {
            $addFields: {
              role_name: { $arrayElemAt: ['$role_info.name', 0] }
            }
          },
          { $project: { password: 0, role_info: 0 ,role_id: 0 } },
          { $sort: { created_at: -1 as const } },
          { $skip: skip },
          { $limit: limit }
        ])
        .toArray(),
      databaseService.users.countDocuments(matchCondition)
    ])

    return {
      staffs,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        total_items: total
      }
    }
  }

  async createAdminAccount(payload: CreateAdminReqBody) {
    // 1. Kiểm tra Role có tồn tại không
    const role = await databaseService.roles.findOne({ _id: new ObjectId(payload.role_id) })
    if (!role) {
      throw new errorWithStatus({
        message: ADMIN_STAFF_MESSAGES.ROLE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // 2. Hash password (đã được validate bắt buộc từ registerValidator)
    const hashedPassword = await passwordHash(payload.password!)

    // 3. Tạo User mới
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role_id: role._id as ObjectId,
      date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : new Date(),
      location: payload.location || ''
    })

    const result = await databaseService.users.insertOne(newUser)
    newUser._id = result.insertedId

    // Ẩn password trước khi return
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }

  async resetAdminPassword(id: string, payload: ResetAdminPasswordReqBody) {
    const hashedPassword = await passwordHash(payload.new_password)

    const updatedUser = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { password: hashedPassword, updated_at: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!updatedUser) {
      throw new errorWithStatus({
        message: ADMIN_STAFF_MESSAGES.STAFF_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    
    // Ngắt toàn bộ phiên đăng nhập cũ (xóa refresh token)
    await databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(id) })

    return updatedUser
  }

  async deleteAdminAccount(id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )

    if (!user) {
      throw new errorWithStatus({
        message: ADMIN_STAFF_MESSAGES.STAFF_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.users.deleteOne({ _id: new ObjectId(id) })
    await databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(id) })

    return user
  }
}

const adminStaffService = new AdminStaffService()
export default adminStaffService
