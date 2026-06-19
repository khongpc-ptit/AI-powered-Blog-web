import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { errorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_COMMENT_MESSAGES } from '~/constants/messages'

class AdminCommentService {
  async getAllComments({
    page = 1,
    limit = 10,
    search = '',
    is_approved
  }: {
    page?: number
    limit?: number
    search?: string
    is_approved?: string
  }) {
    const matchCondition: any = {}

    if (search) {
      matchCondition.$or = [
        { content: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ]
    }

    // Lọc theo trạng thái duyệt
    if (is_approved === 'true') {
      matchCondition.is_approved = true
    } else if (is_approved === 'false') {
      matchCondition.is_approved = false
    }

    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      databaseService.comments
        .find(matchCondition)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.comments.countDocuments(matchCondition)
    ])

    return {
      comments,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        total_items: total
      }
    }
  }

  async approveCommentById(id: string) {
    const comment = await databaseService.comments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_approved: true, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    if (!comment) {
      throw new errorWithStatus({
        message: ADMIN_COMMENT_MESSAGES.COMMENT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return comment
  }

  async deleteCommentById(id: string) {
    const comment = await databaseService.comments.findOne({ _id: new ObjectId(id) })
    if (!comment) {
      throw new errorWithStatus({
        message: ADMIN_COMMENT_MESSAGES.COMMENT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.comments.deleteOne({ _id: new ObjectId(id) })
    return comment
  }
}

const adminCommentService = new AdminCommentService()
export default adminCommentService
