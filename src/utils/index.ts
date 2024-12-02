import { NextFunction, Response, Request } from "express"
import config from "../core/config"

import {
  Secret,
  decode,
  verify,
  sign,
  VerifyOptions,
  VerifyErrors,
} from "jsonwebtoken"
import constants, { IResponse } from "../constants"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { userMessages } from "../files/user/user.messages"

const COUNTRY_CODE = "234"

export interface UtilResponse {
  success: boolean
  msg: string
}

export interface IToken {
  _id: any
  email: string
  isAdmin: boolean
  iat: number
  exp: number
}

const messageHandler = (
  message: string,
  success: boolean,
  statusCode: number,
  data: any
) => {
  let response = {}
  return (response = { message, success, statusCode, data })
}

const tokenHandler = (data: { [key: string]: any }) => {
  var { _id, email, isAdmin = false, ...restOfPayload } = data

  const token = sign(
    {
      _id,
      email,
      isAdmin,
      ...restOfPayload,
    },
    config.SECRET_KEY!,
    { expiresIn: process.env.TOKEN_EXPIRE_IN },
  )
  return { token, _id, email, isAdmin }
}

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    let authToken = req.headers.authorization

    if (authToken) {
      authToken = authToken.split(" ")[1]
      const payload = await verifyToken(authToken)
      if (payload) {
        req.payload = payload
        res.locals.jwt = payload
        return next()
      }
    }

    throw new Error("Not Authorized!")
  } catch (error: any) {
    if (error.message.includes("jwt expired")) {
      error.message = "Token expired, please sign in again"
    }
    return res.status(401).json({ message: error.message })
  }
}

const verifyToken = async (token: string) => {
  try {
    return verify(token, config.SECRET_KEY!)
  } catch (error) {
    throw new Error("Unable to verify token.")
  }
}

const adminVerifier = (_: Request, res: Response, next: NextFunction) => {
  if (res.locals.jwt.isAdmin) {
    //res.locals.jwt is got from the isAuthenticated middleware
    next()
  } else {
    return res
      .status(401)
      .json({ result: userMessages.UNAUTHORISED, status: 401 })
  }
}

const AlphaNumeric = (length: number, type: string = "alpha"): string => {
  var result: string = ""
  var characters: string =
    type === "alpha"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      : "0123456789"

  var charactersLength: number = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const queryConstructor = (query: any, sortBy: string, item: string) => {
  let params: any = {}
  let array = Object.keys(query)
  for (let i = 0; i < array.length; i++) {
    const value = Object.values(query)[i] as string
    if (Object.keys(query)[i] === "id") {
      params["_id"] = new mongoose.Types.ObjectId(value)
    } else if (Object.keys(query)[i] === "userId") {
      params[Object.keys(query)[i]] = new mongoose.Types.ObjectId(value)
    } else {
      params[Object.keys(query)[i]] = value
    }
  }

  let { limit, skip, sort, ...restOfParams } = params
  limit = limit ? Number(limit) : constants.LIMIT
  skip = skip ? Number(skip) : 0

  if (sort === "asc" || sort === "desc") {
    if (typeof sortBy === "object") {
      let first = sortBy[Object.keys(sortBy)[0]]
      let second = sortBy[Object.keys(sortBy)[1]]

      sort =
        sort === "asc"
          ? { [first]: 1, [second]: 1 }
          : { [first]: -1, [second]: -1 }
    } else {
      sort = sort === "asc" ? { [sortBy]: 1 } : { [sortBy]: -1 }
    }
  } else if (sort == undefined) {
    sort = { [sortBy]: 1 }
  } else {
    return {
      error: `Unable to find ${item} might be because of invalid params`,
    }
  }

  return { params: restOfParams, limit, skip, sort }
}

const fileModifier = (req: any) => {
  let { body, file, files, params } = req

  let mediaUrl: string[] = []
  let formBody = {} as { [key: string]: any }
  if (files) {
    for (let file of files) {
      const { path } = file
      mediaUrl.push(path)
    }
    formBody = { image: mediaUrl, body, params }
  } else if (file) {
    //if only one image is uploaded
    const { path } = file
    formBody = { image: path, body, params }
  } else {
    formBody = { body, params }
  }
  return formBody
}

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const verifyPassword = async (
  password: string,
  dbpassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, dbpassword)
}

const verifyPhoneNumber = (phone: string) => {
  return /^([0]{1}|\+?234)([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(phone)
}

const sanitizePhoneNumber = (phone: string) => {
  phone = phone.trim()
  if (phone.length == 10) phone = "0" + phone
  if (!verifyPhoneNumber(phone)) {
    return { status: false, message: "Phone number is invalid", phone: "" }
  }
  if (phone.startsWith("0") || phone.startsWith("+")) {
    phone = phone.substring(1)
  }
  if (phone.startsWith(COUNTRY_CODE)) {
    return { status: true, msg: "Phone number is valid", phone: "+" + phone }
  }
  return {
    status: true,
    msg: "Phone number is valid",
    phone: `+${COUNTRY_CODE}${phone}`,
  }
}

const formatDate = (date: string): Date => {
  return new Date(date)
}

const dateCheck = (initDate: string, endDate?: string): IResponse => {
  const d = new Date()
  const date = new Date(d.setHours(d.getHours() - 2))

  if (initDate < date.toISOString()) {
    return { success: false, msg: "Please select a future date" }
  }

  if (endDate && endDate < initDate) {
    return { success: false, msg: "Start date cannot be greater than end date" }
  }

  return { success: true, msg: "Date verified" }
}

const manageAsyncOps = async <T>(
  fn: Promise<T>
): Promise<[Error | null, Awaited<T> | null]> => {
  try {
    const response = await fn
    return [null, response]
  } catch (error) {
    const err = error as Error
    return [err, null]
  }
}

const trimObjectSpaces = (obj: {
  [key: string]: any
}): { [key: string]: any } => {
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value === "string") obj[key] = value.trim()
  }

  return obj
}

const verifyWhoAmI = (user: IToken, query: { [key: string]: any }): boolean => {
  const { isAdmin } = user

  if (!isAdmin && Object.keys(query).indexOf("userId") > -1 == false)
    //this is to ensure that if it is not an admin signed in, the userId must be passed in as a query
    return false
  return true
}

export {
  messageHandler,
  tokenHandler,
  isAuthenticated,
  adminVerifier,
  AlphaNumeric,
  queryConstructor,
  fileModifier,
  hashPassword,
  verifyPassword,
  sanitizePhoneNumber,
  dateCheck,
  formatDate,
  manageAsyncOps,
  trimObjectSpaces,
  verifyWhoAmI,
}
