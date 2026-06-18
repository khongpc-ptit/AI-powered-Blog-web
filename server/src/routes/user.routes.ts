import express from 'express'
import { getProfileController, updateProfileController, changePasswordController } from '~/controllers/user.controllers'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { updateProfileValidator, changePasswordValidator } from '~/middlewares/user.middlewares'
const userRouter = express.Router()

userRouter.use(accessTokenValidator) // check xem đã đăng nhập hay chưa

userRouter.get('/profile', wrapRequestHandler(getProfileController))
userRouter.patch('/profile', updateProfileValidator, wrapRequestHandler(updateProfileController))
userRouter.patch('/profile/password', changePasswordValidator, wrapRequestHandler(changePasswordController))
export default userRouter
