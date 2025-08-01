import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { AuthRequest } from "../../types/common.interface";
import { TransactionService } from "./transaction.service";
import {
  commissionQuerySchema,
  transactionQuerySchema,
} from "./transaction.validation";

export const getMyTransactions = [
  validateRequest(transactionQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await TransactionService.getMyTransactions(
        req.user!._id,
        req.query
      );
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

export const getAgentCommissions = [
  validateRequest(commissionQuerySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await TransactionService.getAgentCommissions(
        req.user!._id,
        req.query
      );
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

export const getAllTransactions = [
  validateRequest(transactionQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await TransactionService.getAllTransactions(req.query);
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

export const getTransactionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await TransactionService.getTransactionStats();
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
