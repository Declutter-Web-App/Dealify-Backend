import { NextFunction, Response, Request } from 'express'
import UserAuthService from './userAuth.service'
import { manageAsyncOps } from '../../../utils'
import { CustomError } from '../../../utils/error'
import { responseHandler } from '../../../core/response'
import { statusCode } from '../../../constants/statusCode'

class UserAuthController {
  async userSignupController(
    req: Request,
    res: Response, 
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(
      UserAuthService.signUp(req.body)
    )

    if (error) return next(new CustomError(error.message))
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode  .CREATED, data!)
  }

  async userLoginController(
    req: Request,
    res: Response, 
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(
      UserAuthService.login(req.body)
    )

    if (error) return next( new CustomError(error.message))
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode  .SUCCESS, data!)
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(UserAuthService.sendOTP(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(UserAuthService.verifyOTP(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(UserAuthService.verifyEmail(req.body))

    if (error) return next(error)

    if (!data?.success) return next(new CustomError(data!.msg, 400))

    return responseHandler(res, 200, data!)
  }

  async userResetPassword(
    req: Request,
    res: Response, 
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(
      UserAuthService.resetPassword(req.body)
    )

    if (error) return next( new CustomError(error.message))
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode  .SUCCESS, data!)
  }
}

export default new UserAuthController();