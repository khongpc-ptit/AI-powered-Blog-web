import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

const seedRoles = async () => {
  console.log('🌱 Seeding Roles collection...')

  // Xóa dữ liệu cũ nếu có
  await databaseService.roles.deleteMany({})

  // Tạo các role mặc định
  const roles = [
    {
      _id: new ObjectId(),
      name: 'USER',
      description: 'Người dùng thường - có quyền đọc bài viết và bình luận',
      permissions: [],
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'super_admin',
      description: 'Quản trị viên cấp cao - có toàn quyền trong hệ thống',
      permissions: [
        'CREATE_POST',
        'UPDATE_POST',
        'DELETE_POST',
        'CHANGE_POST_STATUS',
        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY',
        'DELETE_COMMENT',
        'UPDATE_USER',
        'DELETE_USER',
        'MANAGE_ADMIN',
        'MANAGE_PERMISSION'
      ],
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'admin',
      description: 'Quản trị viên thường - quản lý nội dung và người dùng',
      permissions: [
        'CREATE_POST',
        'UPDATE_POST',
        'DELETE_POST',
        'CHANGE_POST_STATUS',
        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY',
        'DELETE_COMMENT',
        'UPDATE_USER',
        'DELETE_USER'
      ],
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'content_manager',
      description: 'Quản lý nội dung - tạo và quản lý bài viết, danh mục',
      permissions: [
        'CREATE_POST',
        'UPDATE_POST',
        'DELETE_POST',
        'CHANGE_POST_STATUS',
        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY',
        'DELETE_COMMENT'
      ],
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z')
    },
    {
      _id: new ObjectId(),
      name: 'blogger',
      description: 'Người viết bài - tạo và chỉnh sửa bài viết của mình',
      permissions: [
        'CREATE_POST',
        'UPDATE_POST'
      ],
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-01T00:00:00.000Z')
    }
  ]

  const result = await databaseService.roles.insertMany(roles)
  console.log(`✅ Inserted ${result.insertedCount} roles`)

  // Lưu lại các ObjectId để sử dụng ở các seeding khác
  const roleIds = {
    USER: roles[0]._id,
    SUPER_ADMIN: roles[1]._id,
    ADMIN: roles[2]._id,
    CONTENT_MANAGER: roles[3]._id,
    BLOGGER: roles[4]._id
  }

  return roleIds
}

export default seedRoles
export { seedRoles }
