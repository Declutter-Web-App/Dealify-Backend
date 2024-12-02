import mongoose, { Schema, model } from "mongoose"
import { IUser } from "./user.interface"

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
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
    category: {
      type: String,
      enum: ["admin", "partner"],
      required: true,
    },
    businessName: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    accountDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
    },
  },
  { timestamps: true },
)

const user = model<IUser>("User", UserSchema, "user")

export default user
