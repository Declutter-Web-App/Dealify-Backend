import mongoose from "mongoose"
import { IPagination, IResponse } from "../../constants"
import { IAdmin, IAdminLogin } from "./admin.interface"
import AdminRepository from "./admin.repository"
import { IToken } from "../../utils"
import { adminMessages } from "./admin.messages"

export default class AdminService {
  static async create(adminPayload: IAdmin): Promise<IAdmin | IResponse> {
    return AdminRepository.createAdmin(adminPayload)
  }

  static async fetchAdminWithPassword(
    adminPayload: Partial<IAdmin>,
  ): Promise<IAdminLogin | null> {
    return AdminRepository.fetchAdminWithPassword(adminPayload)
  }

  static async validateAdmin(
    adminPayload: Partial<IAdmin>,
  ): Promise<Pick<IAdmin, "_id"> | null> {
    return AdminRepository.validateAdmin(adminPayload)
  }

  static async updateAdminDetails(
    adminPayload: Partial<IAdmin>,
    update: Partial<IAdmin>,
  ): Promise<{ updatedExisting?: boolean | undefined }> {
    return AdminRepository.updateAdminDetails(adminPayload, update)
  }

  static async updateAdminProfile(
    admin: IToken,
    adminPayload: Partial<IAdmin>,
  ): Promise<IResponse> {
    const { _id } = admin

    const update = await AdminRepository.updateAdminDetails(
      {
        _id: new mongoose.Types.ObjectId(_id),
      },
      { ...adminPayload },
    )
    if (!update)
      return {
        success: false,
        msg: adminMessages.UPDATE_PROFILE_FAILURE,
      }

    return { success: true, msg: adminMessages.UPDATE_PROFILE_SUCCESS }
  }

  static async getAdminDetails(
    adminPayload: Partial<IAdmin & IPagination>,
  ): Promise<IResponse | null> {
    const { _id, email } = adminPayload

    const admin = await AdminRepository.fetchAdminsByParams(
      { _id, email, isDeleted: false },
      { sort: "asc", limit: 0, skip: 0 },
    )

    if (!admin) return { success: false, msg: adminMessages.NOT_FOUND }

    return { success: true, msg: adminMessages.FETCH, data: admin }
  }

  static async deleteAdminProfile(admin: IToken): Promise<IResponse> {
    const { _id } = admin

    const adminDetails = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(_id) },
      {
        $set: { isDeleted: true },
      },
    )

    return { success: true, msg: adminMessages.DELETE }
  }
}
