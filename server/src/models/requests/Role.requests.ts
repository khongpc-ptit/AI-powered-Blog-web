export interface CreateRoleReqBody {
  name: string
  description?: string
  permissions?: string[]
}

export interface UpdateRolePermissionsReqBody {
  permissions: string[]
}
