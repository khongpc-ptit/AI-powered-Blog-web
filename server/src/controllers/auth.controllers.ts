import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  logoutReqBody,
  refreshAccessTokenReqBody,
  TokenPayload,
  UserReqRegister
} from '~/models/requests/UserReqRegister'
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
export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await authService.logout(refresh_token)
  return res.json(result)
}
export const refreshAccessTokenController = async (
  req: Request<ParamsDictionary, any, refreshAccessTokenReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_refresh_token as TokenPayload
  const result = await authService.refreshAccessToken(user_id)
  return res.json(result)
}
