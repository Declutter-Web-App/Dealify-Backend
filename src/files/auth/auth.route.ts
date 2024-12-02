import express from "express"
import authController from "./auth.controller"
const { checkSchema } = require("express-validator")
import validate from "../../validations/validate"
import createAdminValidation from "../../validations/auth/admin_validation"
import loginAdminValidation from "../../validations/auth/login_admin.validation"
import { isAuthenticated } from "../../utils"

const AuthRouter = express.Router()

const {
  createAdmin,
  loginAdmin,
  passwordupdate,
  sendOTP,
  verifyOTP,
  resetPassword
} = authController

//routes
// create entities
AuthRouter.post(
  "/create-admin",
  validate(checkSchema(createAdminValidation)),
  createAdmin
)

AuthRouter.post(
  "/login-admin",
  validate(checkSchema(loginAdminValidation)),
  loginAdmin
)

AuthRouter.post("/send-otp", sendOTP)
AuthRouter.post("/verify/otp", verifyOTP)
AuthRouter.post("/reset/password", resetPassword)

AuthRouter.use(isAuthenticated)

AuthRouter.post("/update/password", passwordupdate)

export default AuthRouter
