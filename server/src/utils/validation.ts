import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityError, errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req) //kiểm tra và gán error vào request
    const errors = validationResult(req)
    const entityError = new EntityError({ errors: {} })
    // if there are no errors, proceed to the next middleware
    if (errors.isEmpty()) {
      return next()
    }
    const errorObjects = errors.mapped()
    for (const key in errorObjects) {
      const { msg } = errorObjects[key]
      if (msg instanceof errorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorObjects[key]
    }
    return next(entityError)
  }
}
