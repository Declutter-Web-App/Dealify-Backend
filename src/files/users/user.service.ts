import mongoose from "mongoose"
import { queryConstructor } from "../../utils"
import { IUser } from "./user.interface"
import { userMessages } from "./user.messages"
import UserRepository from "./user.repository"
import { IResponse } from "../../constants"

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

  static async getDetails() {
    
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

  static async updateService(
    data: {
      params: { userId: string }
      userPayload: Partial<IUser>
    }
  ): Promise<IResponse> {
    const { params, userPayload } = data

    const customer = await UserRepository.updateUserDetails(
      { _id: new mongoose.Types.ObjectId(params.userId) },
      {
        $set: {
          ...userPayload
        }
      }
    )

    if(!customer) return { success: false, msg: userMessages.UPDATE_PROFILE_FAILURE }

    return { success: true, msg: userMessages.UPDATE_PROFILE_SUCCESS }
  }

  static async deleteService(
    data: {
      params: { userId: string }
    }
  ): Promise<IResponse> {
    const { params } = data

    const customer = await UserRepository.updateUserDetails(
      { _id: new mongoose.Types.ObjectId(params.userId) },
      {
        $set: {
          isDeleted: true
        }
      }
    )

    if(!customer) return { success: false, msg: userMessages.UPDATE_PROFILE_FAILURE }

    return { success: true, msg: userMessages.DELETE }
  }
}
