import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import {
  getAllAgents,
  getAllUsers,
  getUserStats,
  toggleAgentApproval,
  toggleUserStatus,
} from "./user.service";
import {
  toggleAgentApprovalSchema,
  toggleUserStatusSchema,
  userQuerySchema,
} from "./user.validation";

export const getAllUsersController = [
  validateRequest(userQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getAllUsers(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to get users",
      });
    }
  },
];

export const getAllAgentsController = [
  validateRequest(userQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getAllAgents(req.query);
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

export const toggleUserStatusController = [
  validateRequest(toggleUserStatusSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await toggleUserStatus(req.body.userId);
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

export const toggleAgentApprovalController = [
  validateRequest(toggleAgentApprovalSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await toggleAgentApproval(req.body.agentId);
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

export const getUserStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getUserStats();
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
