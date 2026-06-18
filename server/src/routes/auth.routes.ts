import express from 'express'
const authRouter = express.Router()
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/auth.middleware'
import {
  registerController,
  loginController,
  logoutController,
  refreshAccessTokenController
} from '~/controllers/auth.controllers'
import { wrapRequestHandler } from '~/utils/handler'

/**
 * Description: Route for user registration
 * Method: POST
 * Endpoint: /users/register
 * Request Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 string }
 */
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * Description: Route for user login
 * Method: POST
 * Endpoint: /login
 * Request Body: { email: string, password: string }
 */
authRouter.post('/login', loginValidator, loginController)
/**
 * Description: Route logout
 * Method: POST
 * Endpoint: /logout
 * Request Body: { email: string, password: string }
 */
authRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))
/**
 * Description: Route logout
 * Method: POST
 * Endpoint: /logout
 * Request Body: {  refresh_token: string }
 */
authRouter.post('/refresh-access-token', refreshTokenValidator, wrapRequestHandler(refreshAccessTokenController))

export default authRouter
