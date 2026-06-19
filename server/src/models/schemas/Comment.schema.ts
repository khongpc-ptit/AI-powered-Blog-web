import { ObjectId } from 'mongodb'

interface CommentType {
  _id?: ObjectId // Optional
  blog_id: ObjectId // Tham chiếu đến _id của bài Blog
  user_id: string
  name: string 
  content: string
  is_approved?: boolean // optional
  created_at?: Date // optional
  updated_at?: Date // optional
}

class Comment {
  _id?: ObjectId
  blog_id: ObjectId
  user_id: string
  name: string
  content: string
  is_approved: boolean
  created_at: Date
  updated_at: Date

  constructor(comment: CommentType) {
    const dateNow = new Date()

    this._id = comment._id
    this.blog_id = comment.blog_id
    this.name = comment.name
    this.content = comment.content
    this.user_id = comment.user_id
    // Không dùng `|| false` ở đây vì nếu người ta truyền vào `false`,
    // phép toán `false || false` dễ gây lỗi logic ẩn.
    // => check thẳng khác undefined
    this.is_approved = comment.is_approved !== undefined ? comment.is_approved : false
    this.created_at = comment.created_at || dateNow
    this.updated_at = comment.updated_at || dateNow
  }
}

export default Comment
