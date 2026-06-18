export const ROLE_CODES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CONTENT_MANAGER: "content_manager",
  BLOGGER: "blogger",
};

export const PERMISSIONS = {
  CREATE_POST: "CREATE_POST",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
  CHANGE_POST_STATUS: "CHANGE_POST_STATUS",

  CREATE_CATEGORY: "CREATE_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",

  DELETE_COMMENT: "DELETE_COMMENT",

  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",

  MANAGE_ADMIN: "MANAGE_ADMIN",
  MANAGE_PERMISSION: "MANAGE_PERMISSION",
};

export const PERMISSION_GROUPS = [
  {
    title: "Bài viết",
    permissions: [
      {
        code: PERMISSIONS.CREATE_POST,
        label: "Thêm bài viết",
        description: "Tạo bài viết mới.",
      },
      {
        code: PERMISSIONS.UPDATE_POST,
        label: "Sửa bài viết",
        description: "Cập nhật nội dung bài viết.",
      },
      {
        code: PERMISSIONS.DELETE_POST,
        label: "Xóa bài viết",
        description: "Xóa bài viết khỏi hệ thống.",
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
        code: PERMISSIONS.CREATE_CATEGORY,
        label: "Thêm danh mục",
        description: "Tạo danh mục mới.",
      },
      {
        code: PERMISSIONS.UPDATE_CATEGORY,
        label: "Sửa danh mục",
        description: "Cập nhật tên hoặc mô tả danh mục.",
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
        code: PERMISSIONS.DELETE_COMMENT,
        label: "Xóa bình luận",
        description: "Xóa bình luận rác hoặc không phù hợp.",
      },
    ],
  },
  {
    title: "Tài khoản",
    permissions: [
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
  },

  [ROLE_CODES.ADMIN]: {
    code: ROLE_CODES.ADMIN,
    label: "Admin",
    description: "Quản trị viên thường.",
    permissions: [
      PERMISSIONS.CREATE_POST,
      PERMISSIONS.UPDATE_POST,
      PERMISSIONS.DELETE_POST,
      PERMISSIONS.CHANGE_POST_STATUS,

      PERMISSIONS.CREATE_CATEGORY,
      PERMISSIONS.UPDATE_CATEGORY,
      PERMISSIONS.DELETE_CATEGORY,

      PERMISSIONS.DELETE_COMMENT,

      PERMISSIONS.UPDATE_USER,
      PERMISSIONS.DELETE_USER,
    ],
  },

  [ROLE_CODES.CONTENT_MANAGER]: {
    code: ROLE_CODES.CONTENT_MANAGER,
    label: "Content Manager",
    description: "Quản lý nội dung.",
    permissions: [
      PERMISSIONS.CREATE_POST,
      PERMISSIONS.UPDATE_POST,
      PERMISSIONS.DELETE_POST,
      PERMISSIONS.CHANGE_POST_STATUS,

      PERMISSIONS.CREATE_CATEGORY,
      PERMISSIONS.UPDATE_CATEGORY,
      PERMISSIONS.DELETE_CATEGORY,

      PERMISSIONS.DELETE_COMMENT,
    ],
  },

  [ROLE_CODES.BLOGGER]: {
    code: ROLE_CODES.BLOGGER,
    label: "Blogger",
    description: "Người viết bài.",
    permissions: [PERMISSIONS.CREATE_POST, PERMISSIONS.UPDATE_POST],
  },
};

export const ROLES = DEFAULT_ROLES;

export const ADMIN_ROLE_CODES = [
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.ADMIN,
  ROLE_CODES.CONTENT_MANAGER,
  ROLE_CODES.BLOGGER,
];

export const ROLE_OPTIONS = [
  {
    code: ROLE_CODES.ADMIN,
    label: "Admin",
  },
  {
    code: ROLE_CODES.CONTENT_MANAGER,
    label: "Content Manager",
  },
  {
    code: ROLE_CODES.BLOGGER,
    label: "Blogger",
  },
];
