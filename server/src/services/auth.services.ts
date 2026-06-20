import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { UserReqRegister } from '~/models/requests/UserRegister.requests'
import { comparePassword, passwordHash } from '~/utils/bcrypt'
import { tokenType, UserVerifyStatus } from '~/constants/enum'
import { signToken } from '~/utils/jwt'
import ms from 'ms'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { USER_MESSAGES } from '~/constants/messages'
import { generateEmailVerifyToken, hashToken } from '~/utils/token'
import { sendVerifyEmail } from '~/services/email.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'

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

    const { rawToken, hashedToken } = generateEmailVerifyToken()

    await databaseService.users.insertOne(
      new User({
        ...payload,
        //vì constructor của User yêu cầu date_of_birth phải là kiểu Date mà userreqregister đang là string
        date_of_birth: new Date(payload.date_of_birth),
        password: password,
        role_id: defaultRole._id as ObjectId,
        verify: UserVerifyStatus.Unverified,
        email_verify_token: hashedToken,
        email_verify_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        email_verified_at: null
      })
    )

    await sendVerifyEmail({
      to: payload.email,
      name: payload.name,
      token: rawToken
    })

    return {
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.'
    }
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
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USER_MESSAGES.LOGOUT_SUCCESS
    }
  }
  async refreshAccessToken(user_id: string) {
    const accessToken = await this.signAccessToken(user_id)
    return { accessToken }
  }

  async verifyEmail(token: string) {
    const hashedToken = hashToken(token)

    const user = await databaseService.users.findOne({
      email_verify_token: hashedToken
    })

    if (!user) {
      throw new errorWithStatus({
        message: 'Link xác thực không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (!user.email_verify_expires_at || user.email_verify_expires_at < new Date()) {
      throw new errorWithStatus({
        message: 'Link xác thực đã hết hạn',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (user.verify === UserVerifyStatus.Verified) {
      return {
        message: 'Tài khoản đã được xác thực trước đó'
      }
    }

    await databaseService.users.updateOne(
      { _id: user._id },
      {
        $set: {
          verify: UserVerifyStatus.Verified,
          email_verified_at: new Date(),
          updated_at: new Date()
        },
        $unset: {
          email_verify_token: '',
          email_verify_expires_at: ''
        }
      }
    )

    return {
      message: 'Xác thực email thành công. Bạn có thể đăng nhập.'
    }
  }

  async resendVerificationEmail(email: string) {
    const user = await databaseService.users.findOne({ email })

    if (!user) {
      throw new errorWithStatus({
        message: 'Không tìm thấy tài khoản',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.verify === UserVerifyStatus.Verified) {
      throw new errorWithStatus({
        message: 'Tài khoản đã được xác thực',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const { rawToken, hashedToken } = generateEmailVerifyToken()

    await databaseService.users.updateOne(
      { _id: user._id },
      {
        $set: {
          email_verify_token: hashedToken,
          email_verify_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          updated_at: new Date()
        }
      }
    )

    await sendVerifyEmail({
      to: user.email,
      name: user.name,
      token: rawToken
    })

    return {
      message: 'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.'
    }
  }
}

const authService = new AuthService()
export default authService
