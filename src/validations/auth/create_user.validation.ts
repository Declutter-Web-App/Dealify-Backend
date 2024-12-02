const createUserValidation = {
  fullName: {
    notEmpty: true,
    errorMessage: "Full Name cannot be empty",
    trim: true,
  },
  email: {
    notEmpty: true,
    isEmail: true,
    errorMessage: "Email cannot be empty",
    trim: true,
  },
  phoneNumber: {
    notEmpty: true,
    errorMessage: "Phone number cannot be empty",
    trim: true,
  },
  course: {
    notEmpty: true,
    errorMessage: "Course cannot be empty",
    trim: true,
  },
}

export default createUserValidation
