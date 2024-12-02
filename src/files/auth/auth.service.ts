import { IResponse } from "../../constants"
import { generalMessages } from "../../core/messages"
import {
  hashPassword,
  tokenHandler,
  verifyPassword,
  trimObjectSpaces,
  AlphaNumeric,
  IToken,
} from "../../utils"
import bcrypt from "bcrypt"
import { sendMailNotification } from "../../utils/email"
import { sendSms } from "../../utils/sms"
import redis from "../../utils/redis"
import { IAdmin, IAdminResetPasswordPayload, IOtp } from "../admin/admin.interface"
import AdminService from "../admin/admin.service"
import { authMessages } from "./auth.messages"
import AdminRepository from "../admin/admin.repository"

export default class AuthService {
  static async createAdmin(rawPayload: IAdmin): Promise<IResponse> {
    const payload = trimObjectSpaces(rawPayload) as IAdmin

    const validateAdmin = await AdminRepository.validateAdmin({ email: payload.email })

    if (validateAdmin) {
      return { success: true, msg: authMessages.ADMIN_EXISTS }
    }

    let { password } = payload
    password = await hashPassword(password)
    await AdminService.create({ ...payload, password })

    const substitutional_parameters = {
      name: payload.fullName,
      email: payload.email,
      password: payload.password
    }

    await sendMailNotification(
      payload.email,
      "Admin Account Creation",
      substitutional_parameters,
      "ADMIN_CREATION"
    )
    return { success: true, msg: authMessages.ADMIN_CREATED }
  }

  static async adminLogin(
    payload: Pick<IAdmin, "email" | "password" >
  ): Promise<IResponse> {
    const { email, password, } = payload
    const admin = await AdminService.fetchAdminWithPassword({ email })

    if (!admin) return { success: false, msg: authMessages.LOGIN_ERROR }

    const {
      _id,
      password: hashedPassword,
    } = admin

    const passwordCheck = await verifyPassword(password, hashedPassword)

    if (!passwordCheck) return { success: false, msg: authMessages.LOGIN_ERROR }

    const token = tokenHandler({ _id, email, isAdmin: true, userType: "admin"  })

    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: {
        ...token,
      },
    }
  }

  static async generateOTP(data: string): Promise<string> {
    const otp = AlphaNumeric(4, "numeric").toString();
  
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
  
    const cacheToken = await redis.setCache({
      key: `OTP:${data}`,
      value: { otp },
    });
  
    return otp;
  }

  static async sendPhoneOTP(
    //for both phone and email delivery
    payload: IOtp,
    subject: string = "Verification",
  ): Promise<IResponse> {
    const { userDetail, type } = payload
    const otp = await this.generateOTP(userDetail!)
    let result: any
    let msg: string = `You have requested to reset your password. Please use the following one-time-password to complete the process; OTP: ${otp}. This OTP will expire in 15 minutes. If you did not request this password reset, please ignore this message.`

    switch (type) {
      case "phoneNumber":
        // send OTP to phone number
        result = await sendSms(userDetail, msg)
        break
      case "email":
        // send OTP to email
        result = await sendMailNotification(
          userDetail,
          subject,
          { otp },
          "EMAIL_VERIFICATION",
        )
        break

      default:
        break
    }

    return { success: true, msg: authMessages.OTP_SENT }    
  }

  static async verifyOTP(payload: {
    userDetail: string
    otp: string
  }): Promise<IResponse> {
    const { userDetail, otp } = payload

    const fetchToken = await redis.getCache(`OTP:${userDetail}`)

    if (!fetchToken)
      return { success: false, msg: authMessages.OTP_VERIFICATION_FAILURE }

    const { otp: cachedOtp, expirationTime } = JSON.parse(fetchToken)

    if (cachedOtp !== otp)
      return { success: false, msg: authMessages.OTP_VERIFICATION_FAILURE }

    const currentTimestamp = Date.now();

    if (currentTimestamp > expirationTime) {
      // OTP has expired
      await redis.deleteCache(`OTP:${userDetail}`);
      return { success: false, msg: authMessages.OTP_EXPIRED };
    }
    

    // If OTP matches, remove it from the cache to make it one-time
    await redis.deleteCache(`OTP:${userDetail}`);

    return { success: true, msg: authMessages.OTP_VERIFICATION_SUCCESS }    
  }

  static async resetPassword(adminPayload: IAdminResetPasswordPayload) : Promise<IResponse> {
    const { email, newPassword, confirmPassword } = adminPayload

    const admin = await AdminRepository.fetchAdminWithPassword({ email })

    if (!admin) {
      return { success: false, msg: authMessages.ADMIN_NOT_FOUND };
    }

    if(newPassword !== confirmPassword) return { success: false, msg: authMessages.PASSWORD_MISMATCH }

    const updatePassword = await AdminRepository.updateAdminDetails(
      { email },
      { password: await hashPassword(newPassword) }
    )

    if (!updatePassword)
      return { success: false, msg: authMessages.PASSWORD_RESET_FAILURE }

    return { success: true, msg: authMessages.PASSWORD_RESET_SUCCESS }
  
  }

  static async updatePassword(adminPayload: IAdminResetPasswordPayload, user: IToken) : Promise<IResponse> {
      const { currentPassword, newPassword, confirmPassword } = adminPayload
      const { _id, email } = user

      const admin = await AdminRepository.fetchAdminWithPassword({ _id })

      if (!admin) {
        return { success: false, msg: authMessages.ADMIN_NOT_FOUND };
      }

      if (!(await verifyPassword(currentPassword, admin.password))) {
        return { success: false, msg: authMessages.INCORRECT_PASSWORD}
      }

      if(newPassword !== confirmPassword) return { success: false, msg: authMessages.PASSWORD_MISMATCH }

      const updatePassword = await AdminRepository.updateAdminDetails(
        { email },
        { password: await hashPassword(newPassword) }
      )

      if (!updatePassword)
        return { success: false, msg: authMessages.PASSWORD_RESET_FAILURE }

      return { success: true, msg: authMessages.PASSWORD_RESET_SUCCESS }
    
  }
}
