import { checkSchema } from 'express-validator'
import { Request } from 'express'
import { USER_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.services'
import { validate } from '~/utils/validation'
import databaseService from '~/services/database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { comparePassword } from '~/utils/bcrypt'
import { verifyToken } from '~/utils/jwt'
import { JsonWebTokenError } from 'jsonwebtoken'
export const registerValidator = validate(
  checkSchema(
    {
      name: {
        in: 'body', // chỉ đóng vai trò là chỉ định ví trí không có chức năng validate
        isLength: {
          options: { min: 1, max: 50 },
          errorMessage: USER_MESSAGES.USERNAME_LENGTH,
          //bail sẽ giúp dừng quá trình validate nếu có lỗi xảy ra ở bước đó
          bail: true
        },
        isString: { errorMessage: USER_MESSAGES.USERNAME_STRING, bail: true },
        notEmpty: {
          errorMessage: USER_MESSAGES.USERNAME_NOT_EMPTY,
          bail: true
        },
        trim: true
      },
      email: {
        in: 'body',
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_INVALID,
          bail: true
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_NOT_EMPTY,
          bail: true
        },
        trim: true,
        custom: {
          options: async (email) => {
            const isEmailExists = await authService.checkEmailExists(email)
            if (isEmailExists) {
              // vì không phải bộ lọc mặc định của express-validator nên sẽ không tự động trả về lỗi mà phải tự ném lỗi ra
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true // báo cho biết là trường này hợp lệ
          },
          bail: true
        }
      },
      password: {
        in: 'body',
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH,
          bail: true
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_NOT_EMPTY,
          bail: true
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGES.PASSWORD_STRONG,
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          bail: true
        }
      },
      confirm_password: {
        in: 'body',
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_NOT_EMPTY,
          bail: true
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MATCH)
            }
            return true
          },
          bail: true
        }
      },
      date_of_birth: {
        in: 'body',
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS_ISO8601,
          bail: true
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_NOT_EMPTY,
          bail: true
        }
      }
    },
    ['body'] //chỉ định nơi mà các trường dữ liệu được lấy lên để validate
  )
)
// lúc ktra email sẽ kiểm tra luôn là có tài khoản nhập có đúng không
export const loginValidator = validate(
  checkSchema(
    {
      password: {
        in: 'body',
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH,
          bail: true
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_NOT_EMPTY,
          bail: true
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGES.PASSWORD_STRONG,
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          bail: true
        }
      },
      email: {
        in: 'body',
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_INVALID,
          bail: true
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_NOT_EMPTY,
          bail: true
        },
        trim: true,
        custom: {
          // lấy được req vì custom validator của express-validator sẽ truyền vào 2 tham số là value (giá trị của trường đang validate) và một object chứa req, location, path
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            })
            if (!user) {
              // vì không phải bộ lọc mặc định của express-validator nên sẽ không tự động trả về lỗi mà phải tự ném lỗi ra
              throw new errorWithStatus({
                message: USER_MESSAGES.EMAIL_OR_PASSWORD_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const isMatch = await comparePassword(req.body.password, user.password)
            if (!isMatch) {
              throw new errorWithStatus({
                message: USER_MESSAGES.EMAIL_OR_PASSWORD_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request).user = user
            return true // báo cho biết là trường này hợp lệ
          },
          bail: true
        }
      }
    },
    ['body']
  )
)
// check tồn tại, đecode và gắn vào req
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1] // Bearer <token>
            if (!access_token) {
              throw new errorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_ISREQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new errorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          },
          bail: true
        }
      }
    },
    ['headers']
  )
)
//check có gửi lên không, xem có tồn tại trong db không, verify và gắn vào req
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        in: 'body',
        notEmpty: {
          errorMessage: USER_MESSAGES.REFRESH_TOKEN_ISREQUIRED,
          bail: true
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decode_refresh_token, refreshToken] = await Promise.all([
                verifyToken({ token: value }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (!refreshToken) {
                throw new errorWithStatus({
                  message: USER_MESSAGES.REFRESH_TOKEN_NOT_EXISTS,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decode_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new errorWithStatus({
                  message: error.message, //verify sai nhảy qua
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
