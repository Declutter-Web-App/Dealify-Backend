import mongoose, { Model } from "mongoose";
import { IResponse } from "../../../constants";
import { generalMessages } from "../../../core/messages";
import { AlphaNumeric, hashPassword, tokenHandler, verifyPassword } from "../../../utils";
import { sendMailNotification } from "../../../utils/email";
import { IUser, IUserResetPasswordPayload } from "../user.interface";
import { userMessages } from "../user.messages";
import UserRepository from "../user.repository";
import redis from "../../../utils/redis";
import { IOtp } from "../../admin/admin.interface";
import { sendSms } from "../../../utils/sms";
import { authMessages } from "../../auth/auth.messages";

export default class UserAuthService {
  static async signUp(userPayload: IUser): Promise<IResponse> {
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

    const token = tokenHandler({ _id: signUp?._id, email: email, userType: signUp?.userType });

    const otp = await this.generateOTP(email!)

    //send mail to user including their unique sign up link
    const substitutional_parameters = {
      name: userPayload.fullName,
      email: userPayload.email,
      password: userPayload.password,
      otp
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
      data: {...token},
    }
  }

  static async verifyEmail(
    payload: {
      userDetail: string
      otp: string
    }
  ): Promise<IResponse> {
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

    await UserRepository.updateUserDetails(
      { email: userDetail },
      { isVerified: true }
    );

    return { success: true, msg: authMessages.OTP_VERIFICATION_SUCCESS }    
  }

  static async login(
    userPayload: Pick<IUser, "email" | "password">
  ): Promise<IResponse> {
    const { email, password } = userPayload;
    const user = await UserRepository.fetchUserWithPassword({ email });

    if (!user) return { success: false, msg: userMessages.LOGIN_ERROR };
    if(user.isDeleted) return { success: false, msg: userMessages.USER_NOT_FOUND }

    const { _id, password: hashedPassword } = user;

    const passwordCheck = await verifyPassword(password, hashedPassword);

    if (!passwordCheck) return { success: false, msg: userMessages.LOGIN_ERROR };

    const token = tokenHandler({ _id, email, userType: user?.userType });

    return {
      success: true,
      msg: userMessages.FETCH_USERS,
      data: {
        ...token,
      },
    };
  }

  static async generateOTP(data: string): Promise<string> {
    const otp = AlphaNumeric(4, "numeric").toString();
  
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
  
    await redis.setCache({
      key: `OTP:${data}`,
      value: { otp },
      expiry: expirationTime,
    });
  
    return otp;
  }

  static async sendOTP(
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

  static async resetPassword(
    userPayload: IUserResetPasswordPayload
  ): Promise<IResponse> {
    const { email, newPassword, confirmPassword } = userPayload;

    const user = await UserRepository.fetchUserWithPassword({ email });

    if (!user) {
      return { success: false, msg: userMessages.USER_NOT_FOUND };
    }

    if (newPassword !== confirmPassword) return { success: false, msg: userMessages.PASSWORD_MISMATCH };

    const updatePassword = await UserRepository.updateUserDetails(
      { email },
      { password: await hashPassword(newPassword) }
    );

    if (!updatePassword)
      return { success: false, msg: userMessages.PASSWORD_RESET_FAILURE };

    return { success: true, msg: userMessages.PASSWORD_RESET_SUCCESS };
  }

  static async updatePassword(userPayload: IUserResetPasswordPayload): Promise<IResponse> {
    const { currentPassword } = userPayload

    const user = await UserRepository.fetchUserWithPassword(
      {
        _id: new mongoose.Types.ObjectId(userPayload._id),
      }
    )

    if (!user) return { success: false, msg: userMessages.USER_NOT_FOUND }

    //verify password
    const passwordMatch = await verifyPassword(currentPassword, user.password)
    if (!passwordMatch) return { success: false, msg: userMessages.PASSWORD_MISMATCH }

    let password = await hashPassword(userPayload.newPassword)

    const changePassword = await UserRepository.updateUserDetails(
      { _id: new mongoose.Types.ObjectId(userPayload._id) },
      {
        password,
      }
    )

    if (!changePassword) return { success: false, msg: userMessages.PASSWORD_RESET_FAILURE }

    return {
      success: true,
      msg: userMessages.PASSWORD_RESET_SUCCESS,
    }
  }
}