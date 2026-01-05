export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateAadhar = (aadhar: string): boolean => {
  const aadharRegex = /^[0-9]{12}$/
  return aadharRegex.test(aadhar.replace(/\D/g, ""))
}

export const validateDrivingLicense = (license: string): boolean => {
  // Basic validation - adjust based on your requirements
  return license.length > 0
}
