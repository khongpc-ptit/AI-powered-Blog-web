import { ObjectId } from 'mongodb'

// Định nghĩa kiểu dữ liệu truyền vào
interface CategoryType {
  _id?: ObjectId
  name: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

class Category {
  _id?: ObjectId
  name: string
  description: string
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const dateNow = new Date()

    this._id = category._id
    this.name = category.name

    this.description = category.description || ''

    this.created_at = category.created_at || dateNow
    this.updated_at = category.updated_at || dateNow
  }
}

export default Category
