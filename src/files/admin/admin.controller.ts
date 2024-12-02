import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { fileModifier, manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import AdminService from "./admin.service"

class AdminController {
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    let { image, body } = fileModifier(req)
    req.body.image = image

    const [error, data] = await manageAsyncOps(
      AdminService.updateAdminProfile(res.locals.jwt, req.body),
    )

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      AdminService.deleteAdminProfile(res.locals.jwt),
    )
    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async getAdminDetails(_: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      AdminService.getAdminDetails(res.locals.jwt),
    )

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }
}

export default new AdminController()
