const loginUserValidation = {
  email: {
    notEmpty: true,
    isEmail: true,
    errorMessage: "Email cannot be empty",
    trim: true,
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
    trim: true,
  },
}

export default loginUserValidation
