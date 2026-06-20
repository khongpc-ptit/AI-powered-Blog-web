import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.shema'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_CATEGORY_MESSAGES } from '~/constants/messages'
import { CreateCategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'

class AdminCategoryService {
  async getAllCategoriesAdmin() {
    const categories = await databaseService.categories.find({}).sort({ created_at: -1 }).toArray()
    return categories
  }

  async createCategory(payload: CreateCategoryReqBody) {
    // Kiểm tra trùng tên
    const existingCategory = await databaseService.categories.findOne({
      name: { $regex: `^${payload.name}$`, $options: 'i' }
    })
    if (existingCategory) {
      throw new errorWithStatus({
        message: ADMIN_CATEGORY_MESSAGES.CATEGORY_NAME_ALREADY_EXISTS,
        status: HTTP_STATUS.CONFLICT
      })
    }

    const newCategory = new Category({
      name: payload.name,
      description: payload.description || ''
    })

    const result = await databaseService.categories.insertOne(newCategory)
    newCategory._id = result.insertedId
    return newCategory
  }

  async updateCategory(id: string, payload: UpdateCategoryReqBody) {
    // Nếu đổi tên thì kiểm tra trùng
    if (payload.name) {
      const existingCategory = await databaseService.categories.findOne({
        name: { $regex: `^${payload.name}$`, $options: 'i' },
        _id: { $ne: new ObjectId(id) }
      })
      if (existingCategory) {
        throw new errorWithStatus({
          message: ADMIN_CATEGORY_MESSAGES.CATEGORY_NAME_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
    }

    const updateData: any = { updated_at: new Date() }
    if (payload.name) updateData.name = payload.name
    if (payload.description !== undefined) updateData.description = payload.description

    const category = await databaseService.categories.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!category) {
      throw new errorWithStatus({
        message: ADMIN_CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return category
  }

  async deleteCategory(id: string) {
    const category = await databaseService.categories.findOne({ _id: new ObjectId(id) })
    if (!category) {
      throw new errorWithStatus({
        message: ADMIN_CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.categories.deleteOne({ _id: new ObjectId(id) })
    return category
  }
}

const adminCategoryService = new AdminCategoryService()
export default adminCategoryService
