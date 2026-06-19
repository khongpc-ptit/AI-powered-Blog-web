export const SYSTEM_PERMISSIONS = [
  // --- Nhóm Dashboard ---
  { name: 'Xem thống kê', code: 'VIEW_DASHBOARD', description: 'Xem các số liệu thống kê trên Dashboard.' },

  // --- Nhóm Bài viết ---
  { name: 'Xem bài viết', code: 'VIEW_POST', description: 'Xem danh sách tất cả bài viết.' },
  { name: 'Thêm bài viết', code: 'CREATE_POST', description: 'Tạo bài viết mới hoặc yêu cầu AI tạo nội dung.' },
  { name: 'Sửa bài viết', code: 'UPDATE_POST', description: 'Cập nhật nội dung bài viết và thay đổi trạng thái xuất bản.' },
  { name: 'Xóa bài viết', code: 'DELETE_POST', description: 'Xóa bỏ bài viết khỏi hệ thống.' },

  // --- Nhóm Danh mục ---
  { name: 'Xem danh mục', code: 'VIEW_CATEGORY', description: 'Xem danh sách danh mục.' },
  { name: 'Thêm danh mục', code: 'CREATE_CATEGORY', description: 'Tạo danh mục phân loại mới.' },
  { name: 'Sửa danh mục', code: 'UPDATE_CATEGORY', description: 'Đổi tên hoặc mô tả danh mục.' },
  { name: 'Xóa danh mục', code: 'DELETE_CATEGORY', description: 'Xóa danh mục khỏi hệ thống.' },

  // --- Nhóm Bình luận ---
  { name: 'Xem bình luận', code: 'VIEW_COMMENT', description: 'Xem danh sách bình luận.' },
  { name: 'Sửa bình luận', code: 'UPDATE_COMMENT', description: 'Duyệt bình luận.' },
  { name: 'Xóa bình luận', code: 'DELETE_COMMENT', description: 'Xóa bình luận của bất kỳ ai (dọn rác).' },

  // --- Nhóm Tài khoản User ---
  { name: 'Xem người dùng', code: 'VIEW_USER', description: 'Xem danh sách người dùng thường.' },
  { name: 'Sửa người dùng', code: 'UPDATE_USER', description: 'Cập nhật thông tin của người dùng thường.' },
  { name: 'Xóa người dùng', code: 'DELETE_USER', description: 'Xóa tài khoản của người dùng thường.' },

  // --- Nhóm Quản trị viên (Staff/Admin) & Phân quyền ---
  {
    name: 'Quản lý Quản trị viên & Phân quyền',
    code: 'MANAGE_ADMIN',
    description: 'Thêm/xóa/sửa các Admin khác, quản lý Role và gán quyền (Quyền tối cao).'
  }
]
