import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import CategoryService from "./categories.service"

class CategoriesController {
  async createCategoryController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(CategoryService.createCategory(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, 201, data!)
  }

  async fetchCategoryController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(CategoryService.fetchCategories(req.query))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, 201, data!)
  }

  async fetchSingleCategoryController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { _id } = req.body
    const [error, data] = await manageAsyncOps(CategoryService.fetchSingleCategory(_id))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, 201, data!)
  }
}

export default new CategoriesController()