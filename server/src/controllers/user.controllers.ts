import { Request, Response } from 'express'
import userService from '~/services/user.services'
// Giả định bạn có định nghĩa USER_MESSAGES
import { USER_MESSAGES } from '~/constants/messages'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/UserReqRegister'
import { UpdateProfileReqBody, ChangePasswordReqBody } from '~/models/requests/UserReqRegister'

export const getProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await userService.getProfile(user_id)

  return res.status(200).json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}
export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const { name, date_of_birth, location } = req.body
  const body = { name, date_of_birth, location }

  const updatedUser = await userService.updateProfile(user_id, body)

  return res.status(200).json({
    message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS,
    result: updatedUser
  })
}
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const { password, new_password } = req.body

  const result = await userService.changePasswordService(user_id, password, new_password)

  return res.status(200).json({
    message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    result
  })
}
