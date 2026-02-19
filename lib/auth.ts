import jwt from "jsonwebtoken";
import { type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User, { type IUser } from "@/lib/models/user";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env.local or your Vercel project settings."
  );
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Sign a JWT token with user payload. Expires in 7 days.
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET!) as JWTPayload;
}

/**
 * Extract the Bearer token from the Authorization header.
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Get the authenticated user from a request.
 * Returns the user document (without password) or null.
 */
export async function getAuthUser(
  request: NextRequest
): Promise<IUser | null> {
  const token = extractToken(request);
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    await connectToDatabase();
    const user = await User.findById(payload.userId).select("-password").lean();
    return user as IUser | null;
  } catch {
    return null;
  }
}

/**
 * Require an authenticated user. Throws a structured error if not authenticated.
 */
export async function requireAuth(
  request: NextRequest
): Promise<IUser> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new AuthError("Authentication required. Please log in.", 401);
  }
  return user;
}

/**
 * Require an admin user. Throws a structured error if not admin.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<IUser> {
  const user = await requireAuth(request);
  if (user.role !== "admin") {
    throw new AuthError("Access denied. Admin privileges required.", 403);
  }
  return user;
}

/**
 * Custom error class for authentication/authorization errors.
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}
