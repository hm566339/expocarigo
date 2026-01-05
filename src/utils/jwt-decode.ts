// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    role?: "USER" | "ADMIN"
}

export function getRoleFromToken(token: string) {
    try {
        const decoded = jwtDecode<JwtPayload>(token)
        return decoded.role ?? null
    } catch (error) {
        console.error("Invalid token", error)
        return null
    }
}
