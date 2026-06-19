export interface CreateCategoryReqBody {
  name: string
  description?: string
}

export interface UpdateCategoryReqBody {
  name?: string
  description?: string
}
