import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req) //kiểm tra và gán error vào request
    const errors = validationResult(req)

    // if there are no errors, proceed to the next middleware
    if (errors.isEmpty()) {
      return next()
    }
    console.log(errors.array())
    return res.json({ message: 'Validation failed', errors: errors.array() })
  }
}
