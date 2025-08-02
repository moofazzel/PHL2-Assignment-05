import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { AuthRequest } from "../../types/common.interface";
import {
  getAgentCommissions,
  getAllTransactions,
  getMyTransactions,
  getTransactionStats,
} from "./transaction.service";
import {
  commissionQuerySchema,
  transactionQuerySchema,
} from "./transaction.validation";

export const getMyTransactionsController = [
  validateRequest(transactionQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await getMyTransactions(req.user!._id, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get transactions",
      });
    }
  },
];

export const getAgentCommissionsController = [
  validateRequest(commissionQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await getAgentCommissions(req.user!._id, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get commission history",
      });
    }
  },
];

export const getAllTransactionsController = [
  validateRequest(transactionQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getAllTransactions(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get all transactions",
      });
    }
  },
];

export const getTransactionStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getTransactionStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get transaction statistics",
    });
  }
};
