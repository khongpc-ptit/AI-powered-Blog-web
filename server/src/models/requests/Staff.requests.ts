export interface GetAllAdminsReqQuery {
  page?: string
  limit?: string
  search?: string
}

export interface CreateAdminReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  role_id: string
  date_of_birth: string
  location?: string
}

export interface ResetAdminPasswordReqBody {
  new_password: string
}
