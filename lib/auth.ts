import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Environment variables - ONLY accessed on server
const getJwtSecret = () => process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"
const getCmsUsername = () => process.env.CMS_USERNAME || "admin"
const getCmsPassword = () => process.env.CMS_PASSWORD || "admin123"

// Types
export interface User {
  username: string
  role: string
}

// Create a JWT token - SERVER ONLY
export async function signToken(payload: User): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret())
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)

  return token
}

// Verify a JWT token - SERVER ONLY
export async function verifyToken(token: string): Promise<User | null> {
  try {
    console.log("Verifying token...")
    const secret = new TextEncoder().encode(getJwtSecret())
    const { payload } = await jwtVerify(token, secret)
    console.log("Token verified successfully")
    return payload as User
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Authenticate a user - SERVER ONLY
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    console.log("Authenticating user:", username)
    // Simple authentication against environment variables
    if (username === getCmsUsername() && password === getCmsPassword()) {
      console.log("Authentication successful")
      return {
        username: username,
        role: "admin",
      }
    }
    console.log("Authentication failed - invalid credentials")
    return null
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Get the current user from cookies - SERVER ONLY
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}
