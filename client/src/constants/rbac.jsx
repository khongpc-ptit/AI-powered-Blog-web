export const ROLE_CODES = {
  SUPER_ADMIN: "super_admin",
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "VIEW_DASHBOARD",

  // Posts
  VIEW_POST: "VIEW_POST",
  CREATE_POST: "CREATE_POST",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
  CHANGE_POST_STATUS: "CHANGE_POST_STATUS",

  // Categories
  VIEW_CATEGORY: "VIEW_CATEGORY",
  CREATE_CATEGORY: "CREATE_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",

  // Comments
  VIEW_COMMENT: "VIEW_COMMENT",
  UPDATE_COMMENT: "UPDATE_COMMENT",
  DELETE_COMMENT: "DELETE_COMMENT",

  // Users
  VIEW_USER: "VIEW_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",

  // Admin Management
  MANAGE_ADMIN: "MANAGE_ADMIN",
  MANAGE_PERMISSION: "MANAGE_PERMISSION",
};

export const PERMISSION_GROUPS = [
  {
    title: "Dashboard",
    permissions: [
      {
        code: PERMISSIONS.VIEW_DASHBOARD,
        label: "Xem thống kê",
        description: "Xem các số liệu thống kê trên Dashboard.",
      },
    ],
  },
  {
    title: "Bài viết",
    permissions: [
      {
        code: PERMISSIONS.VIEW_POST,
        label: "Xem bài viết",
        description: "Xem danh sách tất cả bài viết.",
      },
      {
        code: PERMISSIONS.CREATE_POST,
        label: "Thêm bài viết",
        description: "Tạo bài viết mới hoặc yêu cầu AI tạo nội dung.",
      },
      {
        code: PERMISSIONS.UPDATE_POST,
        label: "Sửa bài viết",
        description: "Cập nhật nội dung bài viết và thay đổi trạng thái xuất bản.",
      },
      {
        code: PERMISSIONS.DELETE_POST,
        label: "Xóa bài viết",
        description: "Xóa bỏ bài viết khỏi hệ thống.",
      },
      {
        code: PERMISSIONS.CHANGE_POST_STATUS,
        label: "Ẩn/Hiện bài viết",
        description: "Thay đổi trạng thái hiển thị bài viết.",
      },
    ],
  },
  {
    title: "Danh mục",
    permissions: [
      {
        code: PERMISSIONS.VIEW_CATEGORY,
        label: "Xem danh mục",
        description: "Xem danh sách danh mục.",
      },
      {
        code: PERMISSIONS.CREATE_CATEGORY,
        label: "Thêm danh mục",
        description: "Tạo danh mục phân loại mới.",
      },
      {
        code: PERMISSIONS.UPDATE_CATEGORY,
        label: "Sửa danh mục",
        description: "Đổi tên hoặc mô tả danh mục.",
      },
      {
        code: PERMISSIONS.DELETE_CATEGORY,
        label: "Xóa danh mục",
        description: "Xóa danh mục khỏi hệ thống.",
      },
    ],
  },
  {
    title: "Bình luận",
    permissions: [
      {
        code: PERMISSIONS.VIEW_COMMENT,
        label: "Xem bình luận",
        description: "Xem danh sách bình luận.",
      },
      {
        code: PERMISSIONS.UPDATE_COMMENT,
        label: "Duyệt bình luận",
        description: "Duyệt bình luận.",
      },
      {
        code: PERMISSIONS.DELETE_COMMENT,
        label: "Xóa bình luận",
        description: "Xóa bình luận của bất kỳ ai (dọn rác).",
      },
    ],
  },
  {
    title: "Tài khoản",
    permissions: [
      {
        code: PERMISSIONS.VIEW_USER,
        label: "Xem người dùng",
        description: "Xem danh sách người dùng thường.",
      },
      {
        code: PERMISSIONS.UPDATE_USER,
        label: "Sửa người dùng",
        description: "Cập nhật thông tin người dùng thường.",
      },
      {
        code: PERMISSIONS.DELETE_USER,
        label: "Xóa người dùng",
        description: "Xóa tài khoản người dùng thường.",
      },
      {
        code: PERMISSIONS.MANAGE_ADMIN,
        label: "Quản lý Admin",
        description: "Thêm, xóa, cập nhật tài khoản quản trị viên.",
      },
      {
        code: PERMISSIONS.MANAGE_PERMISSION,
        label: "Quản lý phân quyền",
        description: "Cho phép thay đổi permission của các role.",
      },
    ],
  },
];

export const DEFAULT_ROLES = {
  [ROLE_CODES.SUPER_ADMIN]: {
    code: ROLE_CODES.SUPER_ADMIN,
    label: "Super Admin",
    description: "Quản trị viên cấp cao, có toàn quyền trong hệ thống.",
    permissions: Object.values(PERMISSIONS),
    locked: true,
    isDefault: true,
  },
};

export const ROLES = DEFAULT_ROLES;

export const ADMIN_ROLE_CODES = [ROLE_CODES.SUPER_ADMIN];

export const ROLE_OPTIONS = [];
