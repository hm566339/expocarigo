// Secure storage for JWT and sensitive data using react-native-keychain

import * as Keychain from "react-native-keychain"

/**
 * Store a secure item in keychain
 */
export const setSecureItem = async (key: string, value: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(key, value, {
      service: key,
    })
    return true
  } catch (error) {
    console.error("Error storing secure item:", error)
    return false
  }
}

/**
 * Retrieve a secure item from keychain
 */
export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: key,
    })
    if (credentials) {
      return credentials.password
    }
    return null
  } catch (error) {
    console.error("Error retrieving secure item:", error)
    return null
  }
}

/**
 * Remove a secure item from keychain
 */
export const removeSecureItem = async (key: string): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: key,
    })
    return true
  } catch (error) {
    console.error("Error removing secure item:", error)
    return false
  }
}

/**
 * Clear all secure items
 */
export const clearAllSecureItems = async (): Promise<boolean> => {
  try {
    // Clear specific keys if you have multiple
    await removeSecureItem("jwt_token")
    await removeSecureItem("user_id")
    await removeSecureItem("owner_id")
    return true
  } catch (error) {
    console.error("Error clearing secure items:", error)
    return false
  }
}
