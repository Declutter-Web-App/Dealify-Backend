const createAdminValidation = {
  fullName: {
    notEmpty: true,
    errorMessage: "Full Name cannot be empty",
  },
  phoneNumber: {
    notEmpty: true,
    errorMessage: "Phone Number cannot be empty",
  },
  email: {
    notEmpty: true,
    isEmail: true,
    errorMessage: "Email cannot be empty",
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
  type: {
    notEmpty: true,
    errorMessage: "Type cannot be empty",
  }
}

export default createAdminValidation
