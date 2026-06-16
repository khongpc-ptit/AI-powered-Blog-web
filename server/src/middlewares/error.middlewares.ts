import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { errorWithStatus } from '~/models/Error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Xử lý các lỗi của errorWithStatus
  if (err instanceof errorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }

  // Xử lý các lỗi khác tự phát sinh
  // Set lại thuộc tính enumrable cho tất cả các property
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true
    })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    error: omit(err, ['stack', 'message'])
  })
}
