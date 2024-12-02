import mongoose from "mongoose"
import { IPagination, IResponse } from "../../constants"
import { generalMessages } from "../../core/messages"
import { AlphaNumeric, hashPassword, queryConstructor } from "../../utils"
import { IUser } from "./user.interface"
import { userMessages } from "./user.messages"
import UserRepository from "./user.repository"
import { sendMailNotification } from "../../utils/email"
import { RequestHandler } from "../../utils/axios.provision"

const url = process.env.BASE_URL || "https://dsep.skillupafrica.com.ng"

export default class UserService {
  // private static paymentProvider: IPaymentProvider;

  // static async getConfig() {
  //   this.paymentProvider = new PaystackPaymentService()
  // }

  private static axiosRequestHandler = RequestHandler.setup({
    headers: {
      "content-type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress",
    },
  })

  static async signup(userPayload: IUser): Promise<IResponse> {
    userPayload.email = userPayload.email.toLowerCase()
    const { email, phoneNumber } = userPayload

    const validateUser = await UserRepository.validateUser({
      $or: [{ email }, { phoneNumber }],
    })

    if (validateUser) return { success: false, msg: userMessages.USER_EXISTS }

    const signUp = await UserRepository.createUser({
      ...userPayload,
      password: await hashPassword(userPayload.password),
    })

    if (!signUp)
      return { success: false, msg: generalMessages.UNEXPECTED_FAILURE }

    //send mail to user including their unique sign up link
    const substitutional_parameters = {
      name: userPayload.fullName,
    }
    await sendMailNotification(
      email,
      "Registration",
      substitutional_parameters,
      "REGISTRATION",
    )

    return {
      success: true,
      msg: userMessages.SIGN_UP_SUCCESS,
      data: { userId: signUp._id },
    }
  }

  static async login() {}

  static async fetchUsersService(query: Partial<IUser>) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Users",
    )

    if (error) return { success: false, msg: error }

    const users = await UserRepository.fetchUsersByParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (users.length < 1)
      return {
        success: false,
        msg: userMessages.NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: userMessages.FETCH_USERS,
      data: users,
    }
  }

  static async searchService(query: Partial<IUser>) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Users",
    )

    if (error) return { success: false, msg: error }

    const users = await UserRepository.search({
      ...params,
      limit,
      skip,
      sort,
    })

    if (users.length < 1)
      return {
        success: false,
        msg: userMessages.NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: userMessages.FETCH_USERS,
      data: users,
    }
  }
}
