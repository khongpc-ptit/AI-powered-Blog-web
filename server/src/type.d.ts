import User from './models/schemas/User.schema'
import { Request } from 'express'
declare module 'express' {
  // vào thẳng module 'express' trong node_modules để khai báo thêm thuộc tính user vào interface Request của express, để có thể truy cập req.user ở bất cứ đâu trong project mà không bị lỗi kiểu
  interface Request {
    user?: User
  }
}
