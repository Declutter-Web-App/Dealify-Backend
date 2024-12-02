import express from "express"
import { isAuthenticated } from "../../utils"
import AdminController from "./admin.controller"
import uploadManager from "../../utils/multer"

const AdminRouter = express.Router()

const { updateProfile, getAdminDetails, deleteAdmin } = AdminController

//authentications
AdminRouter.use(isAuthenticated)

//routes
AdminRouter.get("/", getAdminDetails)
AdminRouter.put(
  "/update",
  uploadManager("ProfileImage").single("image"),
  updateProfile,
)

AdminRouter.delete("/delete", deleteAdmin)
// AdminRouter.post("/reset/password", passwordReset)

export default AdminRouter
