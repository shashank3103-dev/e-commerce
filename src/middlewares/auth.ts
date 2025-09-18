import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/http";

import jwt from "jsonwebtoken";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

export interface AuthedRequest extends Request {
  user?: { sub: string; role: "CUSTOMER" | "SELLER" | "ADMIN" };
}

export function auth(required = true) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (!required) return next();
      throw new AppError("Unauthorized", 401);
    }
    const token = header.replace(/^Bearer\s+/i, "");
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch {
      throw new AppError("Invalid token", 401);
    }
  };
}

// export function requireRole(...roles: Array<"CUSTOMER" | "SELLER" | "ADMIN">) {
//   return (req: AuthedRequest, _res: Response, next: NextFunction) => {
//     if (!req.user) throw new AppError("Unauthorized", 401);
//     if (!roles.includes(req.user.role)) throw new AppError("Forbidden", 403);
//     next();
//   };
// }
