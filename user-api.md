# User API Documentation

Base URL của API user:

- `/api/users`

> Tất cả các route dưới đây đều yêu cầu gửi `Authorization: Bearer <accessToken>` trong header.

---

## 1) Lấy thông tin profile

### Route

- `GET /api/users/profile`

### Frontend cần gửi lên

Header:

```http
Authorization: Bearer <accessToken>
```

Body:

- Không cần body

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Get profile success",
  "result": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "date_of_birth": "...",
    "role_id": "...",
    "location": "...",
    "avatar": "...",
    "verified": "..."
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message                               | Mô tả                                                 |
| ------ | ---------------------------------------------- | ----------------------------------------------------- |
| 401    | `Access token is required`                     | Không gửi header Authorization hoặc token rỗng        |
| 401    | `jwt malformed` / `jwt expired` / lỗi JWT khác | Token không hợp lệ / hết hạn                          |
| 404    | `User not found`                               | Không tìm thấy user tương ứng với user_id trong token |
| 500    | `Internal server error`                        | Lỗi hệ thống                                          |

---

## 2) Cập nhật profile

### Route

- `PATCH /api/users/profile`

### Frontend cần gửi lên

Header:

```http
Authorization: Bearer <accessToken>
```

Body JSON (tùy chọn các trường sau):

```json
{
  "name": "Nguyen Van A",
  "date_of_birth": "2000-01-01",
  "location": "Hà Nội",
  "avatar": "https://example.com/avatar.png"
}
```

> Có thể gửi 1 hoặc nhiều trường. Không gửi gì cả cũng sẽ bị lỗi.

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Update profile successfully",
  "result": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "date_of_birth": "...",
    "role_id": "...",
    "location": "...",
    "avatar": "..."
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message                    | Mô tả                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------- |
| 401    | `Access token is required`          | Thiếu hoặc sai access token                                 |
| 400    | `No valid data provided for update` | Body không có trường nào hợp lệ để cập nhật                 |
| 404    | `User not found`                    | User không tồn tại                                          |
| 422    | `Validation error` + `errors`       | `name`, `date_of_birth`, `location`, `avatar` sai định dạng |
| 500    | `Internal server error`             | Lỗi hệ thống                                                |

### Các validation message dùng cho route này

- `Name must be a string`
- `Name length must be from 1 to 100 characters`
- `Date of birth must be a valid ISO 8601 format`
- `Location must be a string`
- `Avatar must be a valid URL format`

---

## 3) Đổi mật khẩu

### Route

- `PATCH /api/users/profile/password`

### Frontend cần gửi lên

Header:

```http
Authorization: Bearer <accessToken>
```

Body JSON:

```json
{
  "password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Change password successfully",
  "result": {
    "updated_at": "2026-06-18T10:00:00.000Z"
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message              | Mô tả                                        |
| ------ | ----------------------------- | -------------------------------------------- |
| 401    | `Access token is required`    | Thiếu hoặc sai access token                  |
| 400    | `Old password is incorrect`   | Mật khẩu cũ không đúng                       |
| 404    | `User not found`              | User không tồn tại                           |
| 422    | `Validation error` + `errors` | Dữ liệu body sai định dạng hoặc không hợp lệ |
| 500    | `Internal server error`       | Lỗi hệ thống                                 |

### Các validation message dùng cho route này

- `Old password is required`
- `Password must be a string`
- `Password must be between 6 and 50 characters`
- `Password cannot be empty`
- `Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol`
- `Confirm password must match password`

---

## 4) Ghi chú cho frontend

1. Trước khi gọi các API user, frontend cần chắc chắn đã có access token hợp lệ.
2. Khi gọi `PATCH /profile`, frontend nên chỉ gửi những field cần cập nhật để tránh lỗi `No valid data provided for update`.
3. Khi đổi mật khẩu, nên kiểm tra lại:
   - `new_password` có đủ mạnh không
   - `confirm_password` phải khớp `new_password`
4. Nếu muốn lưu token, có thể dùng `localStorage` hoặc secure storage, nhưng cần đảm bảo không lưu sai cách gây rò rỉ token.
