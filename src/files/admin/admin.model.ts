import mongoose, { Schema, model } from "mongoose"
import { IAdmin } from "./admin.interface"

const AdminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: { type: String },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true },
)

const admin = model<IAdmin>("Admin", AdminSchema, "admin")

export default admin
