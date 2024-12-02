import express from "express"
import { isAuthenticated } from "../../utils"
import userController from "./user.controller"
import upload from "../../utils/multer"

const UserRoute = express.Router()

const { fetchUsersController, searchController } =
  userController

//routes
UserRoute.get("/", fetchUsersController)
UserRoute.get("/search", searchController)

export default UserRoute
