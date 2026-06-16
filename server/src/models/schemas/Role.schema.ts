// File: ~/models/Role.ts
import { ObjectId } from 'mongodb'

interface RoleType {
  _id?: ObjectId
  name: string // Tên chức vụ (VD: "Blogger", "Super Admin")
  description?: string // Mô tả (VD: "Người viết bài cho hệ thống")
  permissions?: ObjectId[] // Mảng chứa các ID trỏ sang bảng Permission
  created_at?: Date
  updated_at?: Date
}

class Role {
  _id?: ObjectId
  name: string
  description: string
  permissions: ObjectId[]
  created_at: Date
  updated_at: Date

  constructor(role: RoleType) {
    const dateNow = new Date()
    this._id = role._id
    this.name = role.name
    this.description = role.description || ''

    // Nếu lúc tạo chưa tick chọn quyền nào thì mặc định là mảng rỗng []
    this.permissions = role.permissions || []

    this.created_at = role.created_at || dateNow
    this.updated_at = role.updated_at || dateNow
  }
}

export default Role
