export interface GetAllUsersReqQuery {
  page?: string
  limit?: string
  search?: string
}

export interface AdminUpdateUserReqBody {
  name?: string
  email?: string
  date_of_birth?: string
  location?: string
  role_id?: string
}
