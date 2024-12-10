import { Application } from "express";
import AdminRouter from "../files/admin/admin.route";
import UserAuthRouter from "../files/user/userAuth/userAuth.routes";
import CategoryRouter from "../files/categories/categories.routes";

// Routes goes here
export const routes = (app: Application) => {
  const base = "/api/v1"

  app.use(`${base}/admin`, AdminRouter)
  app.use(`${base}/auth`, UserAuthRouter)
  app.use(`${base}/categories`, CategoryRouter)
}