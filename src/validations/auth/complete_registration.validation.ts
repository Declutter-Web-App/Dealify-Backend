const completeRegistrationValidation = {
  userId: {
    notEmpty: true,
    errorMessage: "UserId is required",
  },
  address: {
    notEmpty: true,
    errorMessage: "Address cannot be empty",
  },
  gender: {
    notEmpty: true,
    errorMessage: "Please select a gender",
  },
  ageRange: {
    notEmpty: true,
    errorMessage: "Age group cannot be empty",
  },
  highestEducation: {
    notEmpty: true,
    errorMessage: "Highest Education cannot be empty",
    trim: true,
  },
  currentOccupation: {
    notEmpty: true,
    errorMessage: "Current occupation cannot be empty",
    trim: true,
  },
  techExperience: {
    notEmpty: true,
    errorMessage: "Please state your tech experience level",
    trim: true,
  },
  statementOfPurpose: {
    notEmpty: true,
    errorMessage: "Statement of purpose cannot be empty",
    trim: true,
  },
  informedBy: {
    notEmpty: true,
    errorMessage: "Please select a field",
  },
  paymentMethod: {
    notEmpty: true,
    errorMessage: "Payment method",
  },
}

export default completeRegistrationValidation
