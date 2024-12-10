import express from "express"
import { isAuthenticated, adminVerifier } from "../../utils"
import categoryController from "./categories.controller"

const CategoryRouter = express.Router()

const { createCategoryController, fetchCategoryController, fetchSingleCategoryController } = categoryController

//routes
CategoryRouter.get("/", fetchCategoryController)
CategoryRouter.get("/data", fetchSingleCategoryController)

//authentications
CategoryRouter.use(isAuthenticated)
CategoryRouter.use(adminVerifier)
CategoryRouter.post("/", createCategoryController)


export default CategoryRouter
