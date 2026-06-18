import { JwtPayload } from 'jsonwebtoken'
import { extend } from 'lodash'
import { tokenType } from '~/constants/enum'

export interface UserReqRegister {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface logoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: tokenType
}
