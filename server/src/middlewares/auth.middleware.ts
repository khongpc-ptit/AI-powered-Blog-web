import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.services'
import { validate } from '~/utils/validation'

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
