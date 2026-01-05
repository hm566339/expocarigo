// /**
//  * Secure Storage Service (Expo Compatible)
//  * Handles encrypted storage for sensitive data like JWT tokens
//  */

// import * as SecureStore from "expo-secure-store";

// /* ================= SAFE STORAGE KEYS =================
//    Expo SecureStore allows ONLY:
//    a-z A-Z 0-9 . - _
//    ❌ NO @
// */
// const ACCESS_TOKEN_KEY = "carigo.access_token";
// const USER_DATA_KEY = "carigo.user_data";

// class StorageService {
//   /* ---------- internal key validation ---------- */
//   private isValidKey(key?: string) {
//     return (
//       typeof key === "string" &&
//       key.length > 0 &&
//       /^[a-zA-Z0-9._-]+$/.test(key)
//     );
//   }

//   /* ---------- set item ---------- */
//   async setItem(key: string, value: string): Promise<void> {
//     if (!this.isValidKey(key)) {
//       console.warn("❌ SecureStore setItem invalid key:", key);
//       return;
//     }

//     await SecureStore.setItemAsync(key, value, {
//       keychainAccessible: SecureStore.WHEN_UNLOCKED,
//     });
//   }

//   /* ---------- get item ---------- */
//   async getItem(key: string): Promise<string | null> {
//     if (!this.isValidKey(key)) {
//       console.warn("❌ SecureStore getItem invalid key:", key);
//       return null;
//     }

//     return await SecureStore.getItemAsync(key);
//   }

//   /* ---------- remove item ---------- */
//   async removeItem(key: string): Promise<void> {
//     if (!this.isValidKey(key)) {
//       console.warn("❌ SecureStore removeItem invalid key:", key);
//       return;
//     }

//     await SecureStore.deleteItemAsync(key);
//   }

//   /* ---------- auth helpers ---------- */
//   async setAuthData(token: string, user: any): Promise<void> {
//     await this.setItem(ACCESS_TOKEN_KEY, token);
//     await this.setItem(USER_DATA_KEY, JSON.stringify(user));
//   }

//   async getAuthData(): Promise<{ token: string | null; user: any | null }> {
//     const token = await this.getItem(ACCESS_TOKEN_KEY);
//     const userData = await this.getItem(USER_DATA_KEY);

//     return {
//       token,
//       user: userData ? JSON.parse(userData) : null,
//     };
//   }

//   async clearAuthData(): Promise<void> {
//     await this.removeItem(ACCESS_TOKEN_KEY);
//     await this.removeItem(USER_DATA_KEY);
//   }
// }

// export default new StorageService();


/**
 * Secure Storage Service (Expo Compatible)
 * Handles encrypted storage for sensitive data like JWT tokens
 */

import * as SecureStore from "expo-secure-store"
import type { User } from "../types/auth.types"

/* ================= SAFE STORAGE KEYS ================= */
const ACCESS_TOKEN_KEY = "carigo.access_token"
const USER_DATA_KEY = "carigo.user_data"

class StorageService {
  /* ---------- key validation ---------- */
  private isValidKey(key?: string): boolean {
    return (
      typeof key === "string" &&
      key.length > 0 &&
      /^[a-zA-Z0-9._-]+$/.test(key)
    )
  }

  /* ---------- set item ---------- */
  async setItem(key: string, value: string): Promise<void> {
    if (!this.isValidKey(key)) {
      console.warn("❌ SecureStore setItem invalid key:", key)
      return
    }

    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    })
  }

  /* ---------- get item ---------- */
  async getItem(key: string): Promise<string | null> {
    if (!this.isValidKey(key)) {
      console.warn("❌ SecureStore getItem invalid key:", key)
      return null
    }

    return SecureStore.getItemAsync(key)
  }

  /* ---------- remove item ---------- */
  async removeItem(key: string): Promise<void> {
    if (!this.isValidKey(key)) {
      console.warn("❌ SecureStore removeItem invalid key:", key)
      return
    }

    await SecureStore.deleteItemAsync(key)
  }

  /* ---------- auth helpers ---------- */
  async setAuthData(token: string, user: User): Promise<void> {
    await this.setItem(ACCESS_TOKEN_KEY, token)
    await this.setItem(USER_DATA_KEY, JSON.stringify(user))
  }

  async getAuthData(): Promise<{
    token: string | null
    user: User | null
  }> {
    const token = await this.getItem(ACCESS_TOKEN_KEY)
    const userData = await this.getItem(USER_DATA_KEY)

    let parsedUser: User | null = null
    if (userData) {
      try {
        parsedUser = JSON.parse(userData)
      } catch {
        console.warn("❌ Failed to parse user data from SecureStore")
      }
    }

    return { token, user: parsedUser }
  }

  async clearAuthData(): Promise<void> {
    await this.removeItem(ACCESS_TOKEN_KEY)
    await this.removeItem(USER_DATA_KEY)
  }
}

export default new StorageService()
