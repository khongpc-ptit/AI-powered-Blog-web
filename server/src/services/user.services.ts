import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { UpdateProfileReqBody } from '~/models/requests/UserReqRegister'
import { comparePassword, passwordHash } from '~/utils/bcrypt'

class UserService {
  async getProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: { password: 0, created_at: 0, updated_at: 0 }
      }
    )
    if (!user) {
      throw new errorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }
  async updateProfile(user_id: string, payload: UpdateProfileReqBody) {
    // xóa bớt field mà có value là undefined
    const updateData = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== undefined))

    // yêu cầu frontend phải dirty check
    if (Object.keys(updateData).length === 0) {
      throw new errorWithStatus({
        message: USER_MESSAGES.NO_DATA_TO_UPDATE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (updateData.date_of_birth) {
      updateData.date_of_birth = new Date(updateData.date_of_birth)
    }

    const updatedUser = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...updateData,
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: { password: 0, created_at: 0, updated_at: 0 }
      }
    )

    if (!updatedUser) {
      throw new errorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return updatedUser
  }
  async changePasswordService(user_id: string, password: string, new_password: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      throw new errorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isMatch = comparePassword(password, user.password)

    if (!isMatch) {
      throw new errorWithStatus({
        message: USER_MESSAGES.password_INCORRECT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const password_new = await passwordHash(new_password)
    const updatedUser = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: password_new,
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: { password: 0, created_at: 0 }
      }
    )
    const updated_at = updatedUser?.updated_at
    return { updated_at }
  }
}

const userService = new UserService()
export default userService
