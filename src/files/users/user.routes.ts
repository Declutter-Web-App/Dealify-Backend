import express from "express"
import { isAuthenticated } from "../../utils"
import userController from "./user.controller"
import upload from "../../utils/multer"

const UserRoute = express.Router()

const { fetchUsersController, searchController, updateController, deleteController } =
  userController


UserRoute.use(isAuthenticated)

//routes
UserRoute.get("/", fetchUsersController)
UserRoute.get("/search", searchController)
UserRoute.put(
  "/:userId",
  updateController,
)
UserRoute.delete(
  "/:userId",
  deleteController,
)

export default UserRoute
