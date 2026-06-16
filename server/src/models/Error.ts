import { ERROR_MESSAGES } from '~/constants/errorMessages'
import HTTP_STATUS from '~/constants/httpStatus'

// Record là một utility type || Record<Keytype, Valuetype>
type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any //index signature
  }
>
export class errorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    // vừa destructuring vừa định nghĩa kiểu dữ liệu cho tham số của constructor là object (dựa vào vế phải)
    this.message = message
    this.status = status
  }
}

//error validation sẽ được định nghĩa ở đây
export class EntityError extends errorWithStatus {
  errors: ErrorType
  constructor({ message = ERROR_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
