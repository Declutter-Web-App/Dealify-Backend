import express from "express"
import { isAuthenticated } from "../../utils"
import userController from "./user.controller"
import upload from "../../utils/multer"
const { checkSchema } = require("express-validator")
import validate from "../../validations/validate"
import {
  createUserValidation,
  // completeRegistrationValidation,
} from "../../validations"

const UserRoute = express.Router()

const { signupController, fetchUsersController, searchController } =
  userController

//routes
UserRoute.post(
  "/signup",
  validate(checkSchema(createUserValidation)),
  signupController,
)

UserRoute.get("/", fetchUsersController)
UserRoute.get("/search", searchController)

export default UserRoute
