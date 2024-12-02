import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { routes } from "./routes";
import { handleApplicationErrors, notFound } from "./response";

export const app = express();

export const application = async () => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet())
  app.use(compression())
  app.use(cors())
  app.use(express.static("public"))
  app.use("/images", express.static("images"))

  app.get("/", (req, res) => {
    res.status(200).json({ message: "App working fine. Welcome" })
  })

  routes(app)
  app.use(handleApplicationErrors) //application errors handler
  app.use(notFound) //not found route
}