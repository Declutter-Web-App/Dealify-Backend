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
