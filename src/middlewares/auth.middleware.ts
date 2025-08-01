import { NextFunction, Response } from "express";
import { JWTPayload } from "../modules/auth/auth.interface";
import { User } from "../modules/user/user.model";
import { AuthRequest } from "../types/common.interface";
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
        message: "Authorization header is required",
      });
      return;
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token) as JWTPayload;

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
      return;
    }

    // For agents, check if approved
    if (user.role === "agent" && !user.isApproved) {
      res.status(403).json({
        success: false,
        message: "Agent account is not approved yet",
      });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isApproved: user.isApproved,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
      return;
    }

    next();
  };
};

export const requireUser = authorize("user");
export const requireAgent = authorize("agent");
export const requireAdmin = authorize("admin");
export const requireUserOrAgent = authorize("user", "agent");
export const requireAgentOrAdmin = authorize("agent", "admin");
