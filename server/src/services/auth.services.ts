import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { UserReqRegister } from '~/models/requests/UserReqRegister'
import { comparePassword, passwordHash } from '~/utils/bcrypt'
import { tokenType } from '~/constants/enum'
import { signToken } from '~/utils/jwt'
import ms from 'ms'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

class AuthService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        type: tokenType.AccessToken
      },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        type: tokenType.RefreshToken
      },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue }
    })
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async registerUser(payload: UserReqRegister) {
    const password = await passwordHash(payload.password)
    const defaultRole = await databaseService.roles.findOne({ name: 'USER' })

    if (!defaultRole) {
      return
    }
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        //vì constructor của User yêu cầu date_of_birth phải là kiểu Date mà userreqregister đang là string
        date_of_birth: new Date(payload.date_of_birth),
        password: password,
        role_id: defaultRole._id as ObjectId
      })
    )
    const user_id = result.insertedId.toString()
    console.log('tới đây')
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
    // luu vao refresh tokens vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
    )
    return { accessToken, refreshToken }
  }
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return !!user
  }
  async login(user: User, password: string) {
    const user_id = user._id as ObjectId
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id.toString())
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
    )
    return { accessToken, refreshToken }
  }
}
const authService = new AuthService()
export default authService
