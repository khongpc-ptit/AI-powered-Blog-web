import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enum'

// sẽ làm kiểu dữ liệu cho class User
interface UserType {
  _id?: ObjectId
  name: string
  password: string
  email: string
  date_of_birth: Date
  role_id: ObjectId
  location?: string //optional
  verify?: UserVerifyStatus
  email_verify_token?: string
  email_verify_expires_at?: Date | null
  email_verified_at?: Date | null
  created_at?: Date
  updated_at?: Date
}

class User {
  // mặc định không có gì sẽ là public
  _id?: ObjectId
  name: string
  email: string
  password: string
  date_of_birth: Date
  created_at: Date
  updated_at: Date
  role_id: ObjectId
  location: string //optional
  verify: UserVerifyStatus
  email_verify_token: string
  email_verify_expires_at: Date | null
  email_verified_at: Date | null

  constructor(user: UserType) {
    const dateNow = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.password = user.password
    this.date_of_birth = user.date_of_birth || dateNow
    this.created_at = user.created_at || dateNow
    this.updated_at = user.updated_at || dateNow
    this.role_id = user.role_id
    this.location = user.location || ''
    this.verify = user.verify ?? UserVerifyStatus.Unverified
    this.email_verify_token = user.email_verify_token || ''
    this.email_verify_expires_at = user.email_verify_expires_at || null
    this.email_verified_at = user.email_verified_at || null
  }
}
export default User
