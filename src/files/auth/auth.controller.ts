import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import AuthService from "./auth.service"

class AuthController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      AuthService.createAdmin(req.body)
    )
    console.log('error', error)
    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))

    return responseHandler(res, 201, data!)
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(AuthService.adminLogin(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 401, data!))

    return responseHandler(res, 200, data!)
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(AuthService.sendPhoneOTP(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(AuthService.verifyOTP(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(AuthService.resetPassword(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async passwordupdate(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(AuthService.updatePassword(req.body, res.locals.jwt))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }
}

export default new AuthController()
