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
    userType: {
      type: String,
      enum: ["seller", "buyer"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
)

const User = model<IUser>("User", UserSchema, "user")

export default User
