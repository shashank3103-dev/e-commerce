import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/http";

// Match your Prisma Role enum
export type Role = "USER" | "SUBADMIN" | "ADMIN";

export interface AuthedRequest extends Request {
  user?: { sub: string; role: Role };
}

/**
 * Authentication middleware
 */
export function auth(required = true) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (!required) return next();
      throw new AppError("Unauthorized: No token provided", 401);
    }

    const token = header.replace(/^Bearer\s+/i, "");
    try {
      const decoded = verifyAccessToken(token) as {
        sub: string;
        role: Role;
      };
      req.user = decoded;
      next();
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }
  };
}

/**
 * Role-based Authorization
 */
export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden: Insufficient role", 403);
    }
    next();
  };
}