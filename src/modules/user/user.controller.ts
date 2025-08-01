import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { UserService } from "./user.service";
import {
  toggleAgentApprovalSchema,
  toggleUserStatusSchema,
  userQuerySchema,
} from "./user.validation";

export const getAllUsers = [
  validateRequest(userQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await UserService.getAllUsers(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to get users",
      });
    }
  },
];

export const getAllAgents = [
  validateRequest(userQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await UserService.getAllAgents(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get agents",
      });
    }
  },
];

export const toggleUserStatus = [
  validateRequest(toggleUserStatusSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await UserService.toggleUserStatus(req.body.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to toggle user status",
      });
    }
  },
];

export const toggleAgentApproval = [
  validateRequest(toggleAgentApprovalSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await UserService.toggleAgentApproval(req.body.agentId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to toggle agent approval",
      });
    }
  },
];

export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await UserService.getUserStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get user statistics",
    });
  }
};
