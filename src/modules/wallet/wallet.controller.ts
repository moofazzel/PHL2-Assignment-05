import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { AuthRequest } from "../../types/common.interface";
import { WalletService } from "./wallet.service";
import {
  addMoneySchema,
  cashInSchema,
  cashOutSchema,
  sendMoneySchema,
  toggleWalletBlockSchema,
  walletQuerySchema,
  withdrawMoneySchema,
} from "./wallet.validation";

export const getWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await WalletService.getWallet(req.user!._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get wallet",
    });
  }
};

export const addMoney = [
  validateRequest(addMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await WalletService.addMoney(
        req.user!._id,
        req.body.amount
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to add money",
      });
    }
  },
];

export const withdrawMoney = [
  validateRequest(withdrawMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await WalletService.withdrawMoney(
        req.user!._id,
        req.body.amount
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to withdraw money",
      });
    }
  },
];

export const sendMoney = [
  validateRequest(sendMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await WalletService.sendMoney(
        req.user!._id,
        req.body.toUserId,
        req.body.amount
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send money",
      });
    }
  },
];

export const cashIn = [
  validateRequest(cashInSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await WalletService.cashIn(
        req.user!._id,
        req.body.userId,
        req.body.amount
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to cash in",
      });
    }
  },
];

export const cashOut = [
  validateRequest(cashOutSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await WalletService.cashOut(
        req.user!._id,
        req.body.userId,
        req.body.amount
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to cash out",
      });
    }
  },
];

export const getAllWallets = [
  validateRequest(walletQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await WalletService.getAllWallets(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get wallets",
      });
    }
  },
];

export const toggleWalletBlock = [
  validateRequest(toggleWalletBlockSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await WalletService.toggleWalletBlock(req.body.walletId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to toggle wallet block",
      });
    }
  },
];
