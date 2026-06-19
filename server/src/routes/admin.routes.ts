import express from 'express'
import { accessTokenValidator, registerValidator } from '~/middlewares/auth.middlewares'
import { requirePermission } from '~/middlewares/permission.middlewares'
import upload from '~/middlewares/upload.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import {
  getAllBlogsAdminController,
  addBlogController,
  updateBlogController,
  togglePublishController,
  generateContentController
} from '~/controllers/admin.blog.controllers'
import { getDashboardStatsController } from '~/controllers/admin.dashboard.controllers'
import {
  getAllCategoriesAdminController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '~/controllers/admin.category.controllers'
import {
  getAllCommentsController,
  approveCommentByIdController,
  deleteCommentByIdController
} from '~/controllers/admin.comment.controllers'
import {
  getAllUsersController,
  updateUserInfoByAdminController,
  deleteUserByAdminController
} from '~/controllers/admin.user.controllers'
import {
  getAllAdminsController,
  createAdminAccountController,
  resetAdminPasswordController,
  deleteAdminAccountController
} from '~/controllers/admin.staff.controllers'
import {
  getAllPermissionsController,
  getAllRolesController,
  createRoleController,
  updateRolePermissionsController
} from '~/controllers/admin.role.controllers'

const adminRouter = express.Router()

adminRouter.use(accessTokenValidator)

// Dashboard (Thống kê)
adminRouter.get('/dashboard', requirePermission('VIEW_DASHBOARD'), wrapRequestHandler(getDashboardStatsController))

// Quản lý Bài viết (Blogs)
adminRouter.get('/blogs', requirePermission('VIEW_POST'), wrapRequestHandler(getAllBlogsAdminController))
adminRouter.post(
  '/blogs',
  requirePermission('CREATE_POST'),
  upload.single('image'),
  wrapRequestHandler(addBlogController)
)
adminRouter.patch(
  '/blogs/:id',
  requirePermission('UPDATE_POST'),
  upload.single('image'),
  wrapRequestHandler(updateBlogController)
)
adminRouter.patch('/blogs/:id/status', requirePermission('UPDATE_POST'), wrapRequestHandler(togglePublishController))
adminRouter.post('/blogs/generate', requirePermission('CREATE_POST'), wrapRequestHandler(generateContentController))

// Quản lý Danh mục (Categories)
adminRouter.get('/categories', requirePermission('VIEW_CATEGORY'), wrapRequestHandler(getAllCategoriesAdminController))
adminRouter.post('/categories', requirePermission('CREATE_CATEGORY'), wrapRequestHandler(createCategoryController))
adminRouter.patch('/categories/:id', requirePermission('UPDATE_CATEGORY'), wrapRequestHandler(updateCategoryController))
adminRouter.delete(
  '/categories/:id',
  requirePermission('DELETE_CATEGORY'),
  wrapRequestHandler(deleteCategoryController)
)

// Quản lý Bình luận (Comments)
adminRouter.get('/comments', requirePermission('VIEW_COMMENT'), wrapRequestHandler(getAllCommentsController))
adminRouter.patch(
  '/comments/:id/approve',
  requirePermission('UPDATE_COMMENT'),
  wrapRequestHandler(approveCommentByIdController)
)
adminRouter.delete(
  '/comments/:id',
  requirePermission('DELETE_COMMENT'),
  wrapRequestHandler(deleteCommentByIdController)
)

//  Quản lý User
adminRouter.get('/users', requirePermission('VIEW_USER'), wrapRequestHandler(getAllUsersController))
adminRouter.patch('/users/:id', requirePermission('UPDATE_USER'), wrapRequestHandler(updateUserInfoByAdminController))
adminRouter.delete('/users/:id', requirePermission('DELETE_USER'), wrapRequestHandler(deleteUserByAdminController))

//Quản lý Nhân sự (Staff/Admins)
adminRouter.get('/staffs', requirePermission('MANAGE_ADMIN'), wrapRequestHandler(getAllAdminsController))
adminRouter.post(
  '/staffs',
  requirePermission('MANAGE_ADMIN'),
  registerValidator,
  wrapRequestHandler(createAdminAccountController)
)
adminRouter.patch(
  '/staffs/:id/password',
  requirePermission('MANAGE_ADMIN'),
  wrapRequestHandler(resetAdminPasswordController)
)
adminRouter.delete('/staffs/:id', requirePermission('MANAGE_ADMIN'), wrapRequestHandler(deleteAdminAccountController))

// 📂 7. Cấu hình Phân quyền động (Roles & Permissions)
adminRouter.get('/permissions', requirePermission('MANAGE_ADMIN'), wrapRequestHandler(getAllPermissionsController))
adminRouter.get('/roles', requirePermission('MANAGE_ADMIN'), wrapRequestHandler(getAllRolesController))
adminRouter.post('/roles', requirePermission('MANAGE_ADMIN'), wrapRequestHandler(createRoleController))
adminRouter.patch(
  '/roles/:id/permissions',
  requirePermission('MANAGE_ADMIN'),
  wrapRequestHandler(updateRolePermissionsController)
)

export default adminRouter
