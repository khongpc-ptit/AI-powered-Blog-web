import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const addCommentValidator = validate(
  checkSchema(
    {
      content: {
        notEmpty: {
          errorMessage: 'Nội dung bình luận không được để trống'
        },
        isString: {
          errorMessage: 'Nội dung bình luận phải là chuỗi'
        },
        trim: true
      }
    },
    ['body']
  )
)
