import { MongoClient } from 'mongodb'
import Permission from '~/models/schemas/Permission.schema' // Thay đổi đường dẫn cho đúng với project của bạn

// URI kết nối MongoDB (Thay thế bằng URI thực tế hoặc lấy từ file .env)
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-kuiimxw-shard-00-00.woqzpal.mongodb.net:27017,ac-kuiimxw-shard-00-01.woqzpal.mongodb.net:27017,ac-kuiimxw-shard-00-02.woqzpal.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-lk4c4u-shard-0&authSource=admin&appName=Backend`

const seedPermissions = async () => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('⏳ Đang kết nối tới Database...')
    const db = client.db(process.env.DB_NAME)
    const permissionCollection = db.collection('permissions')

    // 1. Danh sách các quyền chia theo nhóm như đã thống nhất
    const rawPermissions = [
      // --- Nhóm Bài viết ---
      { name: 'Thêm bài viết', code: 'CREATE_POST', description: 'Tạo bài viết mới.' },
      { name: 'Sửa bài viết', code: 'UPDATE_POST', description: 'Cập nhật nội dung bài viết.' },
      { name: 'Xóa bài viết', code: 'DELETE_POST', description: 'Xóa bỏ bài viết khỏi hệ thống.' },
      { name: 'Ẩn/Hiện bài viết', code: 'CHANGE_POST_STATUS', description: 'Thay đổi trạng thái hiển thị của bài.' },

      // --- Nhóm Danh mục ---
      { name: 'Thêm danh mục', code: 'CREATE_CATEGORY', description: 'Tạo danh mục phân loại mới.' },
      { name: 'Sửa danh mục', code: 'UPDATE_CATEGORY', description: 'Đổi tên hoặc mô tả danh mục.' },
      { name: 'Xóa danh mục', code: 'DELETE_CATEGORY', description: 'Xóa danh mục khỏi hệ thống.' },

      // --- Nhóm Bình luận ---
      { name: 'Tạo bình luận', code: 'CREATE_COMMENT', description: 'Cho phép người dùng để lại bình luận.' },
      { name: 'Xóa bình luận', code: 'DELETE_COMMENT', description: 'Xóa bình luận của bất kỳ ai (dọn rác).' },

      // --- Nhóm Tài khoản ---
      { name: 'Sửa người dùng', code: 'UPDATE_USER', description: 'Cập nhật thông tin của người dùng thường.' },
      { name: 'Xóa người dùng', code: 'DELETE_USER', description: 'Xóa tài khoản của người dùng thường.' },
      {
        name: 'Quản lý Quản trị viên',
        code: 'MANAGE_ADMIN',
        description: 'Thêm mới, xóa, cập nhật mật khẩu của các Admin khác.'
      }
    ]

    // 2. Đi qua Class để tự động sinh _id và created_at, updated_at
    const permissionsToInsert = rawPermissions.map((perm) => new Permission(perm))

    // 3. Xóa dữ liệu cũ (để tránh bị trùng lặp nếu lỡ tay chạy file này 2 lần)
    await permissionCollection.deleteMany({})
    console.log('🧹 Đã dọn dẹp bảng permissions cũ.')

    // 4. Bơm dữ liệu mới vào
    const result = await permissionCollection.insertMany(permissionsToInsert)
    console.log(`✅ Gieo mầm thành công ${result.insertedCount} mã quyền vào Database!`)
  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình gieo mầm:', error)
  } finally {
    // Đóng kết nối
    await client.close()
    console.log('🔌 Đã ngắt kết nối Database.')
  }
}

// Thực thi
seedPermissions()
