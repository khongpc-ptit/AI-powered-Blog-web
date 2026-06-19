import express from "express";
import { accessTokenValidator } from "~/middlewares/auth.middlewares";
import { requirePermission } from "~/middlewares/permission.middlewares";
import upload from "~/middlewares/upload.middlewares";
import { wrapRequestHandler } from "~/utils/handler";
import {
  getAllBlogsAdmin,
  addBlog,
  updateBlog,
  togglePublish,
  generateContent
} from '~/controllers/admin.blog.controllers'

const adminRouter = express.Router()

// ==========================================
// 🛡️ BẬT KHIÊN CHO TOÀN BỘ KHU VỰC ADMIN
// ==========================================
adminRouter.use(accessTokenValidator);

// 📂 2. Quản lý Bài viết (Blogs)
adminRouter.get(
  "/blogs",
  requirePermission("VIEW_POST"),
  wrapRequestHandler(getAllBlogsAdmin)
);
adminRouter.post(
  "/blogs",
  requirePermission("CREATE_POST"),
  upload.single("image"),
  wrapRequestHandler(addBlog)
);
adminRouter.patch(
  "/blogs/:id",
  requirePermission("UPDATE_POST"),
  upload.single("image"),
  wrapRequestHandler(updateBlog)
);
adminRouter.patch(
  "/blogs/:id/status",
  requirePermission("UPDATE_POST"),
  wrapRequestHandler(togglePublish)
);
adminRouter.post(
  "/blogs/generate",
  requirePermission("CREATE_POST"),
  wrapRequestHandler(generateContent)
);

export default adminRouter;
