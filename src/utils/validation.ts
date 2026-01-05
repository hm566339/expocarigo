/**
 * Input Validation Utilities
 */

export const validators = {
  email: (email: string): string | null => {
    if (!email) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return null
  },

  password: (password: string): string | null => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }
    return null
  },

  name: (name: string): string | null => {
    if (!name) {
      return "Name is required"
    }
    if (name.length < 2) {
      return "Name must be at least 2 characters"
    }
    return null
  },

  otp: (otp: string): string | null => {
    if (!otp) {
      return "OTP is required"
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return "OTP must be 6 digits"
    }
    return null
  },
}
