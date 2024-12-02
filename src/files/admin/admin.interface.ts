export interface IAdmin {
  _id?: any
  fullName: string
  email: string
  image: string
  phoneNumber: string
  password: string
  type: string
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IAdminLogin
  extends Pick<IAdmin, "_id" | "email" | "password"> {}

export interface IAdminResetPasswordPayload {
  email: string
  newPassword: string
  currentPassword: string
  confirmPassword: string
}

export interface IOtp {
  userDetail: string
  type: string
}
