// File: ~/models/Permission.ts
import { ObjectId } from 'mongodb'

interface PermissionType {
  _id?: ObjectId
  name: string // Tên hiển thị trên giao diện Admin (VD: "Tạo bài viết")
  code: string // Mã chuẩn hóa dùng trong Middleware (VD: "CREATE_BLOG")
  description?: string // Giải thích chi tiết quyền này làm gì (optional)
  created_at?: Date
  updated_at?: Date
}

class Permission {
  _id?: ObjectId
  name: string
  code: string
  description: string
  created_at: Date
  updated_at: Date

  constructor(permission: PermissionType) {
    const dateNow = new Date()
    this._id = permission._id
    this.name = permission.name

    // Ép kiểu code thành chữ IN HOA
    this.code = permission.code.toUpperCase()

    this.description = permission.description || ''
    this.created_at = permission.created_at || dateNow
    this.updated_at = permission.updated_at || dateNow
  }
}

export default Permission
