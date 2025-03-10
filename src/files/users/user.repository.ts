import { IUser, IUserLogin, IUserSearch } from "./user.interface"
import User from "./user.model"
import pagination, { IPagination } from "../../constants"
import mongoose, { Model } from "mongoose"
import Seller from "./seller/seller.model"
import Buyer from "./buyer/buyer.model"

const { LIMIT, SKIP, SORT } = pagination

export default class UserRepository {
  static async createUser(userPayload: IUser): Promise<IUser> {
    const { userType } = userPayload;

    return userType === 'seller' ? await Seller.create(userPayload) : await Buyer.create(userPayload)
  }

  //use this without save feature
  static async fetchUser(
    userPayload: Partial<IUser>,
    select: Partial<Record<keyof IUser, number | boolean | object>> = {
      _id: 1,
      email: 1,
    },
  ): Promise<Partial<IUser> | null> {
    const user: Awaited<IUser | null> = await User.findOne(
      {
        ...userPayload,
      },
      select,
    ).lean()
    return user
  }

  static async fetchUserWithPassword(
    userPayload: Partial<IUser>,
  ): Promise<IUserLogin | null> {
    const user: Awaited<IUser | null> = await User.findOne(
      {
        ...userPayload,
      },
      { _id: 1, password: 1, email: 1, isDeleted: 1, userType: 1 }
    );
    return user;
  }

  static async updateUserDetails(
    userPayload: Partial<IUser>,
    update:
      | Partial<IUser>
      | { $push?: Record<any, any>; $set?: Record<any, any> }
      | { $set: Partial<IUser> },
  ): Promise<{ updatedExisting?: boolean | undefined }> {
    const { lastErrorObject: response } = await User.findOneAndUpdate(
      {
        ...userPayload,
      },
      { ...update },
      { rawResult: true }, //returns details about the update
    );

    return response!;
  }

  static async validateUser(query: Partial<IUser> | { $or: Partial<IUser>[] }) {
    return User.exists(query)
  }

  static async fetchUsersByParams(
    userPayload: Partial<IUser & IPagination>,
    select: Partial<Record<keyof IUser, number | boolean | object>> = {
      _id: 1,
      email: 1,
    },
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = userPayload
    const user: Awaited<IUser[] | null> = await User.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
    return user
  }

  static async userCountByParams(
    query: Partial<IUser> | Record<string, any>,
  ): Promise<number> {
    const userCount = await User.countDocuments().where({ ...query })

    return userCount
  }

  static async search(query: IUserSearch): Promise<IUser[]> {
    const applicants = await User.find({
      $or: [
        { fullName: { $regex: query.search, $options: "i" } },
        { phoneNumber: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ],
    })
    return applicants
  }
}
