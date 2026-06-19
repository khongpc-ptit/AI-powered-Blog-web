# Blog API Documentation

Base URL của API blog:

- `/api/blogs`

---

## 1) Lấy danh sách chuyên mục (Categories)

### Route

- `GET /api/blogs/categories`

### Frontend cần gửi lên

Không yêu cầu params hoặc body.

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Get categories successfully",
  "result": [
    "Technology",
    "Life Style",
    "Education"
    // ...
  ]
}
```

_(Ghi chú: result có thể trả về mảng các tên chuyên mục hoặc mảng object tùy thuộc database đang lưu)._

### Các lỗi có thể gặp

| Status | Mã lỗi / message        | Mô tả                        |
| ------ | ----------------------- | ---------------------------- |
| 500    | `Internal server error` | Lỗi hệ thống không mong muốn |

---

## 2) Lấy danh sách bài viết (Blogs)

### Route

- `GET /api/blogs`

### Frontend cần gửi lên

Query parameters (tùy chọn - truyền trên URL: `?page=1&limit=10&search=ai`):

- `page`: số trang (mặc định 1)
- `limit`: số lượng bài trên một trang (mặc định 10)
- `search`: từ khóa tìm kiếm (theo title, content)
- `category`: lọc theo tên danh mục (ví dụ: "Technology")
- `sort_by`: sắp xếp theo trường (mặc định "created_at")
- `order`: thứ tự sắp xếp ("asc" hoặc "desc", mặc định "desc")

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Get blogs successfully",
  "result": [
    {
      "_id": "...",
      "title": "...",
      "content": "...",
      "views": 100,
      "created_at": "..."
      // ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_pages": 5
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message        | Mô tả                        |
| ------ | ----------------------- | ---------------------------- |
| 500    | `Internal server error` | Lỗi hệ thống không mong muốn |

---

## 3) Lấy chi tiết bài viết

### Route

- `GET /api/blogs/:id`

### Frontend cần gửi lên

Params:

- `id`: id của bài viết (truyền trực tiếp vào URL)

### Frontend sẽ nhận lại

Nếu thành công (sẽ tự động tăng view count):

```json
{
  "message": "Get blog successfully",
  "result": {
    "_id": "...",
    "title": "...",
    "content": "...",
    "views": 101
    // ...
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message        | Mô tả                                  |
| ------ | ----------------------- | -------------------------------------- |
| 404    | `Blog not found`        | Bài viết không tồn tại (id không đúng) |
| 500    | `Internal server error` | Lỗi hệ thống không mong muốn           |

---

## 4) Lấy bình luận của bài viết

### Route

- `GET /api/blogs/:id/comments`

### Frontend cần gửi lên

Params:

- `id`: id của bài viết (truyền trực tiếp vào URL)

Query parameters (tùy chọn):

- `page`: số trang (mặc định 1)
- `limit`: số lượng bình luận trên một trang (mặc định 10)

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Get comments successfully",
  "result": [
    {
      "_id": "...",
      "blog_id": "...",
      "user_id": "...",
      "name": "Nguyen Van A",
      "content": "Bài viết này hay quá!",
      "created_at": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_pages": 2
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message        | Mô tả                        |
| ------ | ----------------------- | ---------------------------- |
| 500    | `Internal server error` | Lỗi hệ thống không mong muốn |

---

## 5) Thêm bình luận vào bài viết (Yêu cầu đăng nhập)

### Route

- `POST /api/blogs/:id/comments`

### Header bắt buộc

- `Authorization`: `Bearer <access_token>`

### Frontend cần gửi lên

Params:

- `id`: id của bài viết (truyền trực tiếp vào URL)

Body JSON:

```json
{
  "content": "Bài viết rất hữu ích!"
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Add comment successfully",
  "result": {
    "_id": "...",
    "blog_id": "...",
    "user_id": "...",
    "name": "Tên User (tự lấy từ database/token)",
    "content": "Bài viết rất hữu ích!",
    "created_at": "..."
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message                     | Mô tả                                            |
| ------ | ------------------------------------ | ------------------------------------------------ |
| 401    | `Access token is required` / Lỗi JWT | Chưa đăng nhập hoặc token hết hạn / không hợp lệ |
| 422    | `Validation error` + `errors`        | Dữ liệu gửi lên sai hoặc thiếu content           |
| 500    | `Internal server error`              | Lỗi hệ thống không mong muốn                     |

### Ví dụ lỗi validation

```json
{
  "message": "Validation error",
  "errors": {
    "content": {
      "msg": "Nội dung bình luận không được để trống"
    }
  }
}
```

_(Ghi chú: Lỗi validation có thể trả về "Nội dung bình luận phải là chuỗi" nếu kiểu dữ liệu sai)._

---

## 6) Ghi chú quan trọng cho frontend

1. **Các API `GET` (danh sách, chi tiết, bình luận) là Public**, bất cứ ai (kể cả khách vãng lai) cũng có thể gọi mà không cần gửi `accessToken`.
2. **API "Thêm bình luận" bắt buộc đăng nhập**:
   - Phải kèm `accessToken` vào header `Authorization: Bearer <token>`.
   - Backend sẽ tự trích xuất `user_id` và lấy `name` tương ứng từ Database để lưu vào comment nên frontend **chỉ cần gửi `content`** lên trong body.
3. **Phân trang & Tìm kiếm**:
   - `page` và `limit` được cung cấp sẵn cho các danh sách (bài viết, bình luận). Hãy dựa vào field `pagination` từ response để vẽ các nút _Next/Prev_ hoặc _Load More_.
   - Khả năng **tìm kiếm (search)** và **lọc (category)** ở API `GET /api/blogs` hoạt động tốt thông qua Query parameter URL.
