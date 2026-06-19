import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_ROLE_MESSAGES } from '~/constants/messages'
import { CreateRoleReqBody, UpdateRolePermissionsReqBody } from '~/models/requests/Role.requests'
import Role from '~/models/schemas/Role.schema'
import { SYSTEM_PERMISSIONS } from '~/constants/permissions'

class AdminRoleService {
  async getAllPermissions() {
    // Trả về danh sách tĩnh thay vì lấy từ DB do đã gộp quyền vào mảng string
    return SYSTEM_PERMISSIONS
  }

  async getAllRoles() {
    const roles = await databaseService.roles.find().sort({ created_at: -1 }).toArray()
    return roles
  }

  async createRole(payload: CreateRoleReqBody) {
    // 1. Kiểm tra role đã tồn tại chưa
    const existingRole = await databaseService.roles.findOne({ 
      name: { $regex: `^${payload.name}$`, $options: 'i' } 
    })
    
    if (existingRole) {
      throw new errorWithStatus({
        message: ADMIN_ROLE_MESSAGES.ROLE_NAME_ALREADY_EXISTS,
        status: HTTP_STATUS.CONFLICT
      })
    }

    // 2. Tạo role mới
    const newRole = new Role({
      name: payload.name,
      description: payload.description || '',
      permissions: payload.permissions || []
    })

    const result = await databaseService.roles.insertOne(newRole)
    newRole._id = result.insertedId

    return newRole
  }

  async updateRolePermissions(id: string, payload: UpdateRolePermissionsReqBody) {
    // Không cho phép sửa quyền của role 'USER' mặc định (hoặc bạn có thể cho phép tùy logic kinh doanh)
    const role = await databaseService.roles.findOne({ _id: new ObjectId(id) })
    if (!role) {
      throw new errorWithStatus({
        message: ADMIN_ROLE_MESSAGES.ROLE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Cập nhật permissions
    const updatedRole = await databaseService.roles.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { permissions: payload.permissions, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    return updatedRole
  }
}

const adminRoleService = new AdminRoleService()
export default adminRoleService
