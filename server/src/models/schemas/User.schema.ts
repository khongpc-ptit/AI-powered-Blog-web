import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enum'

// sẽ làm kiểu dữ liệu cho class User
interface UserType {
  _id?: ObjectId
  name: string
  password: string
  email: string
  date_of_birth: Date
  email_verified_token?: string // jwt hoac '' nếu đã xác thực email
  forgot_password_token?: string // jwt hoac '' nếu đã xác thực email
  verified?: UserVerifyStatus
  role_id: ObjectId
  location?: string //optional
  avatar?: string //optional
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
  email_verified_token: string // jwt hoac '' nếu đã xác thực email
  forgot_password_token: string // jwt hoac '' nếu đã xác thực email
  verified: UserVerifyStatus
  role_id: ObjectId
  location: string //optional
  avatar: string //optional
  constructor(user: UserType) {
    const dateNow = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.password = user.password
    this.date_of_birth = user.date_of_birth || dateNow
    this.created_at = user.created_at || dateNow
    this.updated_at = user.updated_at || dateNow
    this.email_verified_token = user.email_verified_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verified = user.verified || UserVerifyStatus.Unverified
    this.role_id = user.role_id
    this.location = user.location || ''
    this.avatar = user.avatar || ''
  }
}
export default User
