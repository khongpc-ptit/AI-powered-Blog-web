// File: ~/models/Role.ts
import { ObjectId } from 'mongodb'

interface RoleType {
  _id?: ObjectId
  name: string // Tên chức vụ (VD: "Blogger", "Super Admin")
  description?: string // Mô tả (VD: "Người viết bài cho hệ thống")
  permissions?: string[] // Mảng chứa các mã quyền (VD: ["VIEW_POST", "CREATE_POST"])
  created_at?: Date
  updated_at?: Date
}

class Role {
  _id?: ObjectId
  name: string
  description: string
  permissions: string[]
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
