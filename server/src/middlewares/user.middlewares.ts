import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { USER_MESSAGES } from '~/constants/messages'

export const updateProfileValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        trim: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
        }
      },
      location: {
        optional: true,
        isString: { errorMessage: USER_MESSAGES.LOCATION_MUST_BE_A_STRING },
        trim: true
      },
      avatar: {
        optional: true,
        isURL: { errorMessage: USER_MESSAGES.AVATAR_MUST_BE_A_VALID_URL },
        trim: true
      }
    },
    ['body']
  )
)
export const changePasswordValidator = validate(
  checkSchema(
    {
      password: {
        notEmpty: { errorMessage: USER_MESSAGES.password_IS_REQUIRED },
        isString: { errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING },
        trim: true
      },
      new_password: {
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
      }
    },
    ['body']
  )
)
