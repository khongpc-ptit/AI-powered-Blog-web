import { ObjectId } from 'mongodb'

interface BlogType {
  _id?: string
  title: string
  subtitle: string
  description: string
  category_id: ObjectId
  image: string
  isPublished: boolean
  created_at?: Date
  updated_at?: Date
}
class Blog {
  _id?: string
  title: string
  subtitle: string
  description: string
  category_id: ObjectId
  image: string
  isPublished: boolean
  created_at: Date
  updated_at: Date
  constructor(blog: BlogType) {
    const dateNow = new Date()
    this._id = blog._id // sẽ được tự động gán khi lưu vào MongoDB
    this.title = blog.title
    this.subtitle = blog.subtitle
    this.description = blog.description
    this.category_id = blog.category_id
    this.image = blog.image
    this.isPublished = blog.isPublished
    this.created_at = blog.created_at || dateNow
    this.updated_at = blog.updated_at || dateNow
  }
}
export default Blog
