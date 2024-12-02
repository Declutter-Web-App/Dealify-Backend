export interface IUser extends Partial<IUserExt> {
  _id?: any
  fullName: string
  email: string
  phoneNumber: string
  password: string
  category: "admin" | "partner"
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
