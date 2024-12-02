import { ErrorRequestHandler, Response, Request } from "express";
import { IResponse } from "../constants";
import { CustomError, DuplicateError } from "../utils/error";
import { generalMessages } from "./messages";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleApplicationErrors: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
) => {
  if (err instanceof CustomError) {
    const { errors = {}, message, statusCode } = err
    const payload = 
      Object.keys(errors)?.length > 0 ? { message, errors } : { message }
    return res.status(statusCode).json(payload)
  } else if (err instanceof DuplicateError) {
    const { errors = {}, message, statusCode } = err
    const payload =
      Object.keys(errors)?.length > 0 ? { message, errors } : { message }
    return res.status(statusCode).json(payload) 
  }

  res.status(400).json({ message: generalMessages.UNEXPECTED_FAILURE })
}

export const notFound = (_: any, res: Response) => {
  res.status(400).json({ message: generalMessages.ROUTE_NOT_FOUND })
}

export const responseHandler = (
  res: Response,
  statusCode = 200,
  data: IResponse
) => {
  res.status(statusCode).json(data)
}
