import express from "express"
import userController from "../user.controller"
import validate from "../../../validations/validate"
import { checkSchema } from "express-validator"
import { createUserValidation } from "../../../validations"
import loginUserValidation from "../../../validations/auth/login_user.validations"
import UserAuthController from "./userAuth.controller"

const UserAuthRouter = express.Router()

const { 
  userSignupController, 
  userLoginController, 
  sendOTP, 
  verifyOTP, 
  verifyEmail,
  userResetPassword 
} = UserAuthController

//routes
UserAuthRouter.post(
  "/user/create-account",
  validate(checkSchema(createUserValidation)),
  userSignupController,
)

UserAuthRouter.post(
  "/user/login",
  validate(checkSchema(loginUserValidation)),
  userLoginController
)

UserAuthRouter.post("/user/send-otp", sendOTP)
UserAuthRouter.post("/user/verify/otp", verifyOTP)
UserAuthRouter.post("/user/verify/email", verifyEmail)
UserAuthRouter.post("/user/reset/password", userResetPassword)

export default UserAuthRouter
