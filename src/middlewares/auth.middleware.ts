import { NextFunction, Response } from "express";
import { User } from "../modules/user/user.model";
import { AuthRequest } from "../types";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
      return;
    }

    // For agents, check if they are approved
    if (user.role === "agent" && !user.isApproved) {
      res.status(403).json({
        success: false,
        message: "Agent account is not approved",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized.`,
      });
      return;
    }

    next();
  };
};

// Specific role middlewares
export const requireUser = authorize("user");
export const requireAgent = authorize("agent");
export const requireAdmin = authorize("admin");
export const requireUserOrAgent = authorize("user", "agent");
export const requireAgentOrAdmin = authorize("agent", "admin");
