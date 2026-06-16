import express from 'express'
const authRouter = express.Router()
import { registerValidator } from '~/middlewares/auth.middleware'
import { registerController } from '~/controllers/auth.controllers'

authRouter.post('/register', registerValidator, registerController)

export default authRouter
