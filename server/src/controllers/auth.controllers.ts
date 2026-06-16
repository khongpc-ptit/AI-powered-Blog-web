import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserReqRegister } from '~/models/requests/UserReqRegister'
import authService from '~/services/auth.services'
export const registerController = async (req: Request<ParamsDictionary, any, UserReqRegister>, res: Response) => {
  const result = await authService.registerUser(req.body)
  return res.json({ message: 'Đăng ký thành công', result })
}
