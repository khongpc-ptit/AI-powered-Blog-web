import { Request, Response, NextFunction, request, RequestHandler } from 'express'

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error) // nó sẽ được đẩy defaultErrorHandler xử lý
    }
  }
}
