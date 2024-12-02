const loginAdminValidation = {
  email: {
    notEmpty: true,
    errorMessage: "Email cannot be empty",
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
}

export default loginAdminValidation
