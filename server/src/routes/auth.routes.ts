import express from 'express'
const authRouter = express.Router()
import { registerValidator } from '~/middlewares/auth.middleware'
import { registerController } from '~/controllers/auth.controllers'
import { wrapRequestHandler } from '~/utils/handler'
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default authRouter
