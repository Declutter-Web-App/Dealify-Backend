import { NextFunction, Response, Request } from "express"

const { validationResult } = require("express-validator")

const validate = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v: any) => v.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    res.status(400).json({ success: false, errors: errors.array() })
  }
}

export default validate
