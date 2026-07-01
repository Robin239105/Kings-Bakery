import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development-only-replace-in-env";

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign admin user payload to generate a JWT token.
 */
export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT token and return decoded payload, or null if invalid.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract and validate admin credentials from request header or cookies.
 */
export function validateAdminRequest(request: Request): AdminTokenPayload | null {
  try {
    // 1. Check Authorization Header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyAdminToken(token);
      if (decoded) return decoded;
    }

    // 2. Check Cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) {
      const token = match[1];
      const decoded = verifyAdminToken(token);
      if (decoded) return decoded;
    }

    return null;
  } catch (error) {
    return null;
  }
}
