export interface IUser extends Partial<IUserExt> {
  _id?: any
  fullName: string
  email: string
  phoneNumber: string
  password: string
  userType: "seller" | "buyer"
  isDeleted: boolean
  isVerified: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface IUserExt {
  registrationNumber: string
  businessName: string
  location: string
  image: string
  accountDetails: accountDetails
}

interface accountDetails {
  bankName: string
  accountName: string
  accountNumber: string
}

export interface IUserSearch {
  search: string
  status?: string
  startDate: Date
  endDate: Date
}

export interface IUserLogin 
  extends Pick<IUser, "_id" | "email" | "password" | "isDeleted" | "userType"> {}

  export interface IUserResetPasswordPayload {
    _id: string
    email: string
    newPassword: string
    currentPassword: string
    confirmPassword: string
  }