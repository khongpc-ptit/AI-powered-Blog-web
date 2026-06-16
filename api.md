```js
// File: src/app.js (hoặc server.ts)
// File: src/app.ts (hoặc server.ts)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import 3 file Router chúng ta vừa thiết kế
import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";
import adminRouter from "./routes/admin.routes";

const app = express();

// ==========================================
// 1. CÁC MIDDLEWARE TOÀN CỤC (GLOBAL)
// ==========================================

// Cấu hình CORS để cho phép Frontend (React chạy ở port 3000) gọi API
// Bắt buộc phải có credentials: true để trình duyệt gửi kèm HttpOnly Cookie
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Đọc dữ liệu JSON gửi từ body request
app.use(express.json());

// Đọc Cookie từ request (Rất quan trọng cho luồng Refresh Token)
app.use(cookieParser());

// ==========================================
// 2. CHIA NHÁNH ROUTER (NGÃ TƯ ĐƯỜNG)
// ==========================================

// Nhánh 1: Xác thực & Định danh (Dùng chung cho cả Admin & User)
app.use("/api/auth", authRouter);

// Nhánh 2: Nghiệp vụ Public & User cá nhân (CMS/Blog)
app.use("/api/blogs", blogRouter);

// Nhánh 3: Nghiệp vụ Quản trị (Khu vực nhạy cảm, có khiên bảo vệ)
app.use("/api/admin", adminRouter);

// ==========================================
// 3. KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`🔑 Cổng Auth:    http://localhost:${PORT}/api/auth`);
  console.log(`📝 Cổng Blog:    http://localhost:${PORT}/api/blogs`);
  console.log(`🛡️  Cổng Admin:   http://localhost:${PORT}/api/admin`);
});

export default app;
```

```js
import express from "express";
import {
  login,
  register,
  refreshToken,
  logout,
} from "../controllers/auth.controller";

const authRouter = express.Router();
// prefix api : /api/auth
// 🔓 Mọi người đều dùng chung các API này
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
```

```js
// file : Blog.routes.ts
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
// import các controller tương ứng...
// prefix Api : /api/blogs
const blogRouter = express.Router();

// ==========================================
// 🔓 NHÓM PUBLIC (Khách vãng lai cũng dùng được)
// ==========================================

// 📂 1. Bài viết (Blogs)
blogRouter.get("/", getAllBlogs); // Lấy danh sách (phân trang, tìm kiếm)
blogRouter.get("/:id", getBlogById); // Xem chi tiết

// 📂 2. Danh mục (Categories)
blogRouter.get("/categories", getAllCategories);

// 📂 3. Bình luận (Comments)
blogRouter.get("/:id/comments", getBlogComments); // Xem bình luận của 1 bài viết

// ==========================================
// 🔒 NHÓM PROTECTED (Bắt buộc User đăng nhập)
// ==========================================
blogRouter.use(verifyToken);

// 📂 4. Tương tác bình luận
blogRouter.post(
  "/:id/comments",
  requirePermission("CREATE_COMMENT"),
  addComment,
);

// 📂 5. Quản lý tài khoản User cá nhân
blogRouter.get("/profile", getUserProfile);
blogRouter.patch("/profile", updateUserProfile);
blogRouter.patch("/profile/password", changeUserPassword);

export default blogRouter;
```

```js
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import upload from "../middlewares/upload.middleware";
// import các controller tương ứng...

const adminRouter = express.Router();

// ==========================================
// 🛡️ BẬT KHIÊN CHO TOÀN BỘ KHU VỰC ADMIN
// ==========================================
adminRouter.use(verifyToken);
// Toàn tiền cho tất cả api phía dưới /api/admin
// 📂 1. Dashboard (Thống kê) || Chắc sẽ không làm
adminRouter.get(
  "/dashboard",
  requirePermission("VIEW_DASHBOARD"),
  getDashboard,
);

// 📂 2. Quản lý Bài viết (Blogs)
adminRouter.get("/blogs", requirePermission("MANAGE_POST"), getAllBlogsAdmin);
adminRouter.post(
  "/blogs",
  requirePermission("CREATE_POST"),
  upload.single("image"),
  addBlog,
);
adminRouter.patch(
  "/blogs/:id",
  requirePermission("UPDATE_POST"),
  upload.single("image"),
  updateBlog,
);
adminRouter.delete(
  "/blogs/:id",
  requirePermission("DELETE_POST"),
  deleteBlogById,
);
adminRouter.patch(
  "/blogs/:id/status",
  requirePermission("CHANGE_POST_STATUS"),
  togglePublish,
);
// (Tùy chọn) Tính năng tạo nội dung bằng AI
adminRouter.post(
  "/blogs/generate",
  requirePermission("CREATE_POST"),
  generateContent,
);

// 📂 3. Quản lý Danh mục (Categories)
adminRouter.post(
  "/categories",
  requirePermission("CREATE_CATEGORY"),
  createCategory,
);
adminRouter.patch(
  "/categories/:id",
  requirePermission("UPDATE_CATEGORY"),
  updateCategory,
);
adminRouter.delete(
  "/categories/:id",
  requirePermission("DELETE_CATEGORY"),
  deleteCategory,
);

// 📂 4. Quản lý Bình luận (Comments)
adminRouter.get(
  "/comments",
  requirePermission("MANAGE_COMMENT"),
  getAllComments,
);
adminRouter.patch(
  "/comments/:id/approve",
  requirePermission("UPDATE_COMMENT"),
  approveCommentById,
);
adminRouter.delete(
  "/comments/:id",
  requirePermission("DELETE_COMMENT"),
  deleteCommentById,
);

// 📂 5. Quản lý User
adminRouter.get("/users", requirePermission("MANAGE_USER"), getAllUsers);
adminRouter.patch(
  "/users/:id",
  requirePermission("UPDATE_USER"),
  updateUserInfoByAdmin,
);
adminRouter.delete(
  "/users/:id",
  requirePermission("DELETE_USER"),
  deleteUserByAdmin,
);

// 📂 6. Quản lý Nhân sự (Staff/Admins)
adminRouter.get("/staffs", requirePermission("MANAGE_ADMIN"), getAllAdmins);
adminRouter.post(
  "/staffs",
  requirePermission("MANAGE_ADMIN"),
  createAdminAccount,
);
adminRouter.patch(
  "/staffs/:id/password",
  requirePermission("MANAGE_ADMIN"),
  resetAdminPassword,
);
adminRouter.delete(
  "/staffs/:id",
  requirePermission("MANAGE_ADMIN"),
  deleteAdminAccount,
);

// 📂 7. Cấu hình Phân quyền động (Roles & Permissions)
adminRouter.get(
  "/permissions",
  requirePermission("MANAGE_ADMIN"),
  getAllPermissions,
); // Lấy DS quyền gốc
adminRouter.get("/roles", requirePermission("MANAGE_ADMIN"), getAllRoles);
adminRouter.post("/roles", requirePermission("MANAGE_ADMIN"), createRole);
adminRouter.patch(
  "/roles/:id/permissions",
  requirePermission("MANAGE_ADMIN"),
  updateRolePermissions,
);

export default adminRouter;
```

**7 module chính**. Dưới đây là danh sách toàn bộ các file Controllers và Services bạn cần tạo:

### 1. Module Auth (Xác thực)

- **File Controller:** `auth.controller.ts`
- **File Service:** `auth.service.ts`
- **Các hàm (Methods):**
- `register` (Public)
- `login` (Public)
- `refreshToken` (Public)
- `logout` (Public)

### 2. Module Blog (Bài viết)

- **File Controller:** `blog.controller.ts`
- **File Service:** `blog.service.ts`
- **Các hàm (Methods):**
- `getAllBlogs` (Hiển thị list cho Public, có phân trang/lọc)
- `getBlogById` (Xem chi tiết)
- `getAllBlogsAdmin` (Hiển thị list cho Admin, bao gồm cả bài nháp)
- `addBlog` (Tạo bài mới + Upload ảnh)
- `updateBlog` (Sửa nội dung bài)
- `deleteBlogById` (Xóa bài)
- `togglePublish` (Ẩn/Hiện bài viết)
- `generateContent` (Gọi API AI tạo nội dung)

### 3. Module Category (Danh mục)

- **File Controller:** `category.controller.ts`
- **File Service:** `category.service.ts`
- **Các hàm (Methods):**
- `getAllCategories` (Dùng chung cho cả Public và Admin)
- `createCategory`
- `updateCategory`
- `deleteCategory`

### 4. Module Comment (Bình luận)

- **File Controller:** `comment.controller.ts`
- **File Service:** `comment.service.ts`
- **Các hàm (Methods):**
- `getBlogComments` (Lấy bình luận theo ID bài viết cho Public)
- `addComment` (User bình luận)
- `getAllComments` (Admin xem tất cả bình luận trên hệ thống)
- `approveCommentById` (Admin duyệt/đổi trạng thái bình luận)
- `deleteCommentById` (Admin xóa bình luận)

### 5. Module User (Người dùng)

- **File Controller:** `user.controller.ts`
- **File Service:** `user.service.ts`
- **Các hàm (Methods):**
- `getUserProfile` (Lấy thông tin cá nhân)
- `updateUserProfile` (User tự sửa thông tin)
- `changeUserPassword` (User tự đổi mật khẩu)
- `getAllUsers` (Admin quản lý danh sách user)
- `updateUserInfoByAdmin` (Admin sửa thông tin user)
- `deleteUserByAdmin` (Admin khóa/xóa user)

### 6. Module Staff & RBAC (Nhân sự & Phân quyền)

Để code không bị phình to, module này nên chia làm 2 cặp file riêng biệt:

- **Quản lý Nhân sự:** `staff.controller.ts` & `staff.service.ts`
- `getAllAdmins` (Danh sách nhân viên)
- `createAdminAccount` (Tạo tài khoản nhân viên mới)
- `resetAdminPassword` (Đổi mật khẩu nhân viên)
- `deleteAdminAccount` (Xóa nhân viên)

- **Quản lý Quyền (Roles):** `role.controller.ts` & `role.service.ts`
- `getAllPermissions` (Lấy mảng quyền gốc)
- `getAllRoles` (Lấy danh sách chức vụ)
- `createRole` (Tạo chức vụ mới)
- `updateRolePermissions` (Sửa quyền của một chức vụ)

### 7. Module Dashboard (Thống kê)

- **File Controller:** `dashboard.controller.ts`
- **File Service:** `dashboard.service.ts`
- **Các hàm (Methods):**
- `getDashboard` (Hàm này trong Service sẽ gọi chéo sang các model khác như Blog, User, Comment để đếm tổng số lượng (Count) và trả về một Object số liệu thống kê cho biểu đồ).

---

**Mẹo tổ chức thư mục:**
Với số lượng Controller và Service khá nhiều như thế này, bạn nên nhóm chúng vào các folder theo cấu trúc _Domain-Driven_ (Tư duy theo nghiệp vụ) thay vì nhét tất cả vào một thư mục `controllers/` khổng lồ.

Ví dụ thư mục `src/` của bạn sẽ trông rất "pro" như thế này:

- `src/modules/auth/` (chứa `auth.controller.ts`, `auth.service.ts`)
- `src/modules/blog/` (chứa `blog.controller.ts`, `blog.service.ts`)
- `src/modules/user/` ...
