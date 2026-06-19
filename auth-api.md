# Auth API Documentation

Base URL của API auth:

- `/api/auth`

---

## 1) Đăng ký tài khoản

### Route

- `POST /api/auth/register`

### Frontend cần gửi lên

Body JSON:

```json
{
  "name": "Nguyen Van A",
  "email": "a@gmail.com",
  "password": "Abc123!@#",
  "confirm_password": "Abc123!@#",
  "date_of_birth": "2000-01-01" (ISOString)
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Đăng ký thành công",
  "result": {
    "accessToken": "<jwt_access_token>",
    "refreshToken": "<jwt_refresh_token>"
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message              | Mô tả                                        |
| ------ | ----------------------------- | -------------------------------------------- |
| 422    | `Validation error` + `errors` | Dữ liệu body sai định dạng hoặc không hợp lệ |
| 401    | `Email already exists`        | Email đã tồn tại                             |
| 500    | `Internal server error`       | Lỗi hệ thống không mong muốn                 |

### Ví dụ lỗi validation

```json
{
  "message": "Validation error",
  "errors": {
    "email": {
      "msg": "Email must be a valid email address"
    },
    "password": {
      "msg": "Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
    },
    "confirm_password": {
      "msg": "Confirm password must match password"
    }
  }
}
```

---

## 2) Đăng nhập

### Route

- `POST /api/auth/login`

### Frontend cần gửi lên

Body JSON:

```json
{
  "email": "a@gmail.com",
  "password": "Abc123!@#"
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Login successful",
  "result": {
    "accessToken": "<jwt_access_token>",
    "refreshToken": "<jwt_refresh_token>"
  }
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message               | Mô tả                                       |
| ------ | ------------------------------ | ------------------------------------------- |
| 422    | `Validation error` + `errors`  | Email/password sai format hoặc thiếu trường |
| 401    | `Email or password is invalid` | Email không tồn tại hoặc mật khẩu sai       |
| 500    | `Internal server error`        | Lỗi hệ thống                                |

### Ví dụ lỗi login

```json
{
  "message": "Email or password is invalid",
  "status": 401
}
```

> Lưu ý: trong code, lỗi này được throw bằng `errorWithStatus` nên response sẽ là JSON chỉ chứa `message` và `status` (vì middleware bỏ `status` đi trước khi trả về).

---

## 3) Đăng xuất

### Route

- `POST /api/auth/logout`

### Frontend cần gửi lên

Body JSON:

```json
{
  "refresh_token": "<refresh_token>"
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "message": "Logout success"
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message                               | Mô tả                                   |
| ------ | ---------------------------------------------- | --------------------------------------- |
| 422    | `Validation error` + `errors`                  | `refresh_token` không hợp lệ hoặc thiếu |
| 401    | `Refresh token cannot be empty`                | Không gửi refresh token                 |
| 401    | `Refresh token does not exist`                 | Refresh token không có trong DB         |
| 401    | `jwt malformed` / `jwt expired` / lỗi JWT khác | Refresh token không hợp lệ hoặc hết hạn |
| 500    | `Internal server error`                        | Lỗi hệ thống                            |

---

## 4) Refresh access token

### Route

- `POST /api/auth/refresh-access-token`

### Frontend cần gửi lên

Body JSON:

```json
{
  "refresh_token": "<refresh_token>"
}
```

### Frontend sẽ nhận lại

Nếu thành công:

```json
{
  "accessToken": "<new_access_token>"
}
```

### Các lỗi có thể gặp

| Status | Mã lỗi / message                | Mô tả                                    |
| ------ | ------------------------------- | ---------------------------------------- |
| 422    | `Validation error` + `errors`   | `refresh_token` thiếu hoặc sai định dạng |
| 401    | `Refresh token cannot be empty` | Không gửi refresh token                  |
| 401    | `Refresh token does not exist`  | Refresh token không tồn tại trong DB     |
| 401    | `jwt malformed` / `jwt expired` | Refresh token hết hạn hoặc sai           |
| 500    | `Internal server error`         | Lỗi hệ thống                             |

---

## 5) Các message validation dùng trong auth

Các message này được định nghĩa trong [server/src/constants/messages.ts](../src/constants/messages.ts).

### Register / Login

- `Username must be between 1 and 50 characters`
- `Username must be a string`
- `Username cannot be empty`
- `Email must be a valid email address`
- `Email cannot be empty`
- `Email already exists`
- `Password must be between 6 and 50 characters`
- `Password cannot be empty`
- `Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol`
- `Confirm password must match password`
- `Date of birth cannot be empty`
- `Date of birth must be a valid ISO8601 date`

### Refresh token / logout

- `Refresh token cannot be empty`
- `Refresh token does not exist`
- `Refresh token is invalid`

---

## 6) Ghi chú quan trọng cho frontend

1. Sau khi `register` hoặc `login` thành công, frontend nên lưu:
   - `accessToken` vào memory / state / storage phù hợp
   - `refreshToken` vào secure storage hoặc httpOnly cookie nếu có thể, Hiện tại hãy làm theo Local storage nha anh Hùng

2. Khi gọi `refresh-access-token`, frontend cần gửi đúng body:

```json
{
  "refresh_token": "..."
}
```

3. Khi gọi `logout`, frontend nên gửi refresh token hiện tại để server xóa token khỏi DB.
