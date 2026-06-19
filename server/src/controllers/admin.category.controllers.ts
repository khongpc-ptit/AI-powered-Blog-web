import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { CreateCategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import adminCategoryService from '~/services/admin.category.services'
import { ADMIN_CATEGORY_MESSAGES } from '~/constants/messages'

export const getAllCategoriesAdminController = async (req: Request, res: Response) => {
  const categories = await adminCategoryService.getAllCategoriesAdmin()

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_CATEGORY_MESSAGES.GET_ALL_CATEGORIES_SUCCESS,
    result: categories
  })
}

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateCategoryReqBody>,
  res: Response
) => {
  const { name, description } = req.body

  const category = await adminCategoryService.createCategory({ name, description })

  return res.status(HTTP_STATUS.CREATED).json({
    message: ADMIN_CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
    result: category
  })
}

export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, UpdateCategoryReqBody>,
  res: Response
) => {
  const { id } = req.params as { id: string }
  const { name, description } = req.body

  const category = await adminCategoryService.updateCategory(id, { name, description })

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
    result: category
  })
}

export const deleteCategoryController = async (req: Request<ParamsDictionary>, res: Response) => {
  const { id } = req.params as { id: string }

  const category = await adminCategoryService.deleteCategory(id)

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESS,
    result: category
  })
}
