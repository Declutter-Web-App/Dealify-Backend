import { NextFunction, Response, Request } from 'express'
import { responseHandler } from '../../core/response'
import { manageAsyncOps } from '../../utils'
import { CustomError } from '../../utils/error'
import UserService from './user.service'
import { statusCode } from '../../constants/statusCode'

class UserController {
  async fetchUsersController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      UserService.fetchUsersService(req.query),
    )
    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async searchController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      UserService.searchService(req.query),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async updateController( 
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(
      UserService.updateService({
        params: req.params as { userId: string },
        userPayload: req.body,
      }),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async deleteController( 
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    const [error, data] = await manageAsyncOps(
      UserService.deleteService({
        params: req.params as { userId: string },
      }),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }
}

export default new UserController()
