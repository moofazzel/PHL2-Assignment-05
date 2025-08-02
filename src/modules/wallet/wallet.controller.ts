import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { AuthRequest } from "../../types/common.interface";
import {
  addMoney,
  cashIn,
  cashOut,
  getAllWallets,
  getWallet,
  sendMoney,
  toggleWalletBlock,
  withdrawMoney,
} from "./wallet.service";
import {
  addMoneySchema,
  cashInSchema,
  cashOutSchema,
  sendMoneySchema,
  toggleWalletBlockSchema,
  walletQuerySchema,
  withdrawMoneySchema,
} from "./wallet.validation";

export const getWalletController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await getWallet(req.user!._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get wallet",
    });
  }
};

export const addMoneyController = [
  validateRequest(addMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await addMoney(req.user!._id, req.body.amount);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to add money",
      });
    }
  },
];

export const withdrawMoneyController = [
  validateRequest(withdrawMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await withdrawMoney(req.user!._id, req.body.amount);
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

export const sendMoneyController = [
  validateRequest(sendMoneySchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await sendMoney(
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

export const cashInController = [
  validateRequest(cashInSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await cashIn(
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

export const cashOutController = [
  validateRequest(cashOutSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await cashOut(
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

export const getAllWalletsController = [
  validateRequest(walletQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getAllWallets(req.query);
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

export const toggleWalletBlockController = [
  validateRequest(toggleWalletBlockSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await toggleWalletBlock(req.body.walletId);
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
