import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserReqRegister } from '~/models/requests/UserReqRegister'
import authService from '~/services/auth.services'
import User from '~/models/schemas/User.schema'
import { USER_MESSAGES } from '~/constants/messages'

export const registerController = async (req: Request<ParamsDictionary, any, UserReqRegister>, res: Response) => {
  const result = await authService.registerUser(req.body)
  return res.json({ message: 'Đăng ký thành công', result })
}
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User // đã thêm ở file type.d.ts và user được truyền ở checkschema qua
  const result = await authService.login(user, req.body.password)
  return res.json({ message: USER_MESSAGES.LOGIN_SUCCESS, result })
}
