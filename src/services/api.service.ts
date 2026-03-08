import { API_CONFIG, STORAGE_KEYS } from "../config/api.config";
import StorageService from "./storage.service";

type Method = "GET" | "POST" | "PUT" | "DELETE";

/* ================= HELPERS ================= */

const isPublicAuthApi = (url: string) =>
  url.includes("/user/login") ||
  url.includes("/user/register") ||
  url.includes("/user/send-otp") ||
  url.includes("/user/verify-otp");

const isStringResponseApi = (url: string) =>
  url.includes("aadhaar-front-url") ||
  url.includes("aadhaar-back-url") ||
  url.includes("selfie-url") ||
  url.includes("driving-license-url");

/* ================= CORE REQUEST ================= */

async function request(
  method: Method,
  url: string,
  body?: any,
  isMultipart = false,
) {
  const token = await StorageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const headers: Record<string, string> = {};

  // 🔐 Authorization
  if (token && !isPublicAuthApi(url)) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 📦 Content-Type (never set for multipart)
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
    method,
    headers,
    body: body ? (isMultipart ? body : JSON.stringify(body)) : undefined,
  });

  // ❌ Error handling
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  // 🔑 AUTH APIs → STRING TOKEN
  if (isPublicAuthApi(url)) {
    return response.text();
  }

  // 🖼️ KYC URL APIs → STRING URL
  if (isStringResponseApi(url)) {
    return response.text();
  }

  // 🚫 No content
  if (response.status === 204) return null;

  // ✅ Default → JSON
  return response.json();
}

/* ================= API EXPORT ================= */

const api = {
  get: <T>(url: string): Promise<T> => request("GET", url),

  post: <T>(url: string, data?: any): Promise<T> => request("POST", url, data),

  put: <T>(url: string, data?: any): Promise<T> => request("PUT", url, data),

  delete: <T>(url: string): Promise<T> => request("DELETE", url),

  upload: <T>(
    url: string,
    formData: FormData,
    method: "POST" | "PUT",
  ): Promise<T> => request(method, url, formData, true),
};

export default api;
