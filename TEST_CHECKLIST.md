# TEST CHECKLIST - Frontend vs Backend API

## Hướng dẫn Test

1. **Chuẩn bị**: Đảm bảo Server (port 3000) và Client (port 5173) đang chạy
2. **Mở DevTools** (F12) → Tab **Network** để xem requests
3. **Tick ✅** khi test thành công, **Ghi lỗi ❌** nếu có vấn đề

---

## PHẦN 1: AUTH APIs (`auth-api.md`)

### ✅ 1. ĐĂNG KÝ - `POST /api/auth/register`

**UI Location**: `/register`

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Đăng ký với dữ liệu hợp lệ (name, email, password đúng format, date_of_birth) | Redirect về trang chủ, user tự động login, token được lưu | ⬜ |
| Đăng ký với email đã tồn tại | Hiển thị lỗi "Email already exists" | ⬜ |
| Đăng ký với password yếu (< 6 chars, không có uppercase/symbol) | Hiển thị validation error message | ⬜ |
| Đăng ký với password không khớp confirm_password | Hiển thị "Confirm password must match password" | ⬜ |
| Đăng ký với email sai format | Hiển thị "Email must be a valid email address" | ⬜ |
| Đăng ký bỏ trống các trường bắt buộc | Hiển thị lỗi validation tương ứng | ⬜ |

### ✅ 2. ĐĂNG NHẬP - `POST /api/auth/login`

**UI Location**: `/login`

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Đăng nhập với email/password đúng | Redirect về trang trước đó (hoặc home), user được login | ⬜ |
| Đăng nhập với email không tồn tại | Hiển thị "Email or password is invalid" | ⬜ |
| Đăng nhập với password sai | Hiển thị "Email or password is invalid" | ⬜ |
| Đăng nhập bỏ trống email/password | Hiển thị validation error | ⬜ |
| Sau khi login, kiểm tra Navbar hiển thị tên user và nút Logout | User info hiển thị đúng | ⬜ |

### ✅ 3. ĐĂNG XUẤT - `POST /api/auth/logout`

**UI Location**: Navbar (nút Logout)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Click nút Logout | Token bị xóa, chuyển về trang chủ, user không còn logged in | ⬜ |
| Kiểm tra Navbar sau logout | Hiển thị Login/Register thay vì User info | ⬜ |

### ✅ 4. REFRESH TOKEN (Background)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Access token hết hạn (sau ~15 phút) | Hệ thống tự động gọi refresh, user không bị logout | ⬜ |
| Refresh token cũng hết hạn | User bị logout, chuyển về trang login | ⬜ |

---

## PHẦN 2: USER APIs (`user-api.md`)

> ⚠️ **Yêu cầu**: Cần đăng nhập trước khi test các APIs dưới

### ✅ 1. LẤY THÔNG TIN PROFILE - `GET /api/users/profile`

**UI Location**: `/profile` hoặc Navbar (user info)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| User đã login → vào trang Profile | Hiển thị đầy đủ: name, email, date_of_birth, location, avatar | ⬜ |
| Chưa login → vào trang Profile | Redirect về trang login | ⬜ |
| Token hết hạn → vào trang Profile | Redirect về trang login | ⬜ |

### ✅ 2. CẬP NHẬT PROFILE - `PATCH /api/users/profile`

**UI Location**: `/profile` (form chỉnh sửa)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Cập nhật name mới → Save | Name được cập nhật, hiển thị trên UI | ⬜ |
| Cập nhật date_of_birth mới → Save | Ngày sinh được cập nhật | ⬜ |
| Cập nhật location mới → Save | Location được cập nhật | ⬜ |
| Cập nhật avatar URL mới → Save | Avatar mới hiển thị | ⬜ |
| Cập nhật nhiều field cùng lúc | Tất cả fields được cập nhật | ⬜ |
| Gửi empty body hoặc không thay đổi gì | Hiển thị lỗi "No valid data provided for update" | ⬜ |
| Name quá dài (> 100 chars) | Hiển thị validation error | ⬜ |

### ✅ 3. ĐỔI MẬT KHẨU - `PATCH /api/users/profile/password`

**UI Location**: `/profile` (phần đổi password)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Đổi password với đầy đủ thông tin | Password được đổi thành công | ⬜ |
| Nhập sai password cũ | Hiển thị "Old password is incorrect" | ⬜ |
| New password và confirm password không khớp | Hiển thị validation error | ⬜ |
| New password yếu | Hiển thị validation error về password format | ⬜ |
| Sau đổi password thành công → Logout → Login với password mới | Login thành công | ⬜ |

---

## PHẦN 3: BLOG APIs (`blogRouter_api.md`)

### ✅ 1. LẤY DANH SÁCH CATEGORIES - `GET /api/blogs/categories`

**UI Location**: BlogList page (category filter tabs)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Mở trang Blog (Home) | Hiển thị tabs: All, Technology, Startup, Lifestyle... | ⬜ |
| Click tab "Technology" | Chỉ hiển thị blogs thuộc category Technology | ⬜ |
| Click tab "All" | Hiển thị tất cả blogs | ⬜ |

### ✅ 2. LẤY DANH SÁCH BLOGS - `GET /api/blogs`

**UI Location**: Trang chủ / BlogList

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Mở trang chủ | Hiển thị danh sách blogs với hình ảnh, tiêu đề, mô tả, category | ⬜ |
| **Pagination**: Click "Next" / trang 2 | Chuyển sang trang 2, blogs khác hiển thị | ⬜ |
| **Pagination**: Click "Prev" | Quay lại trang 1 | ⬜ |
| **Pagination**: Click số trang cụ thể | Chuyển đến trang được chọn | ⬜ |
| **Search**: Nhập từ khóa vào ô search | Blogs được lọc theo title/content chứa từ khóa | ⬜ |
| **Filter by Category**: Chọn category | Chỉ hiển thị blogs thuộc category đó | ⬜ |
| **Sort**: Chọn "Newest First" | Blogs sắp xếp theo ngày tạo giảm dần | ⬜ |
| **Sort**: Chọn "Oldest First" | Blogs sắp xếp theo ngày tạo tăng dần | ⬜ |
| **Sort**: Chọn "Title (A-Z)" | Blogs sắp xếp theo title tăng dần | ⬜ |
| **Sort**: Chọn "Title (Z-A)" | Blogs sắp xếp theo title giảm dần | ⬜ |
| **Kết hợp**: Search + Category + Sort | Áp dụng tất cả filters cùng lúc | ⬜ |
| **Items per page**: Chọn 4, 8, 12, 16, 20 | Số blogs hiển thị thay đổi theo lựa chọn | ⬜ |

### ✅ 3. LẤY CHI TIẾT BLOG - `GET /api/blogs/:id`

**UI Location**: Trang chi tiết blog `/blogs/:id`

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Click vào blog card → Mở trang chi tiết | Hiển thị đầy đủ: title, subtitle, category, nội dung (HTML), hình ảnh | ⬜ |
| Kiểm tra views count | Số views tăng 1 mỗi lần refresh trang | ⬜ |
| Mở blog với ID không tồn tại | Hiển thị "Blog not found" | ⬜ |

### ✅ 4. LẤY BÌNH LUẬN - `GET /api/blogs/:id/comments`

**UI Location**: Trang chi tiết blog (phần Comments)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| Blog có bình luận | Hiển thị danh sách bình luận với name, content, thời gian | ⬜ |
| Blog không có bình luận | Hiển thị message "There are no comments yet..." | ⬜ |

### ✅ 5. THÊM BÌNH LUẬN - `POST /api/blogs/:id/comments`

**UI Location**: Trang chi tiết blog (form comment)

| Test Case | Expected Behavior | Status |
|-----------|------------------|--------|
| **Đã login**: Submit comment | Comment mới xuất hiện ngay, hiển thị user name | ⬜ |
| **Chưa login**: Submit comment | Redirect sang trang login | ⬜ |
| **Đã login**: Submit với nội dung rỗng | Hiển thị validation error | ⬜ |
| Sau khi submit thành công, form được clear | Ô textarea trống, sẵn sàng nhập comment mới | ⬜ |

---

## GHI CHÚ TEST

### Dữ liệu test đề xuất:

**Register:**
```
Name: Test User
Email: testuser@example.com
Password: TestPass123!
Confirm Password: TestPass123!
Date of Birth: 2000-01-01
```

**Login:**
```
Email: testuser@example.com
Password: TestPass123!
```

**Comment:**
```
Content: Bài viết rất hữu ích, cảm ơn tác giả!
```

### Checklist Tổng Kết:

| STT | Chức năng | ✅ Pass | ❌ Fail |
|-----|-----------|--------|---------|
| 1 | Register | ⬜ | ⬜ |
| 2 | Login | ⬜ | ⬜ |
| 3 | Logout | ⬜ | ⬜ |
| 4 | Get Profile | ⬜ | ⬜ |
| 5 | Update Profile | ⬜ | ⬜ |
| 6 | Change Password | ⬜ | ⬜ |
| 7 | Get Categories | ⬜ | ⬜ |
| 8 | Get Blogs (list) | ⬜ | ⬜ |
| 9 | Pagination | ⬜ | ⬜ |
| 10 | Search | ⬜ | ⬜ |
| 11 | Filter by Category | ⬜ | ⬜ |
| 12 | Sort | ⬜ | ⬜ |
| 13 | Get Blog Detail | ⬜ | ⬜ |
| 14 | Get Comments | ⬜ | ⬜ |
| 15 | Add Comment | ⬜ | ⬜ |

---

## BÁO CÁO LỖI

Nếu có lỗi, ghi rõ:
1. **Chức năng**: ...
2. **Steps to reproduce**: ...
3. **Expected**: ...
4. **Actual**: ...
5. **Screenshot/Network log**: (nếu có)
