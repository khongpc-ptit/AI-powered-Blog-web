export interface AddCommentReqBody {
  content: string
}

export interface CreateBlogReqBody {
  title: string
  subtitle: string
  description: string
  category_id: string
  isPublished?: string | boolean
  image?: string
}

export interface UpdateBlogReqBody {
  title?: string
  subtitle?: string
  description?: string
  category_id?: string
  isPublished?: string | boolean
  image?: string
}

export interface GetAllBlogsReqQuery {
  page?: string
  limit?: string
  search?: string
}

export interface GenerateBlogContentReqBody {
  prompt: string
}
