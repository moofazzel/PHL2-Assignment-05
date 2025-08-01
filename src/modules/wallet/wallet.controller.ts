import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiResponse, AuthRequest } from "../../types";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "./wallet.model";

// Get wallet balance and details
export const getWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user!.userId }).populate(
      "userId",
      "name email phone"
    );

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Wallet details retrieved successfully",
      data: wallet,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get wallet error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add money to wallet (for users)
export const addMoney = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ৳1"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount } = req.body;
      const userId = req.user!.userId;

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
        return;
      }

      if (wallet.isBlocked) {
        res.status(403).json({
          success: false,
          message: "Wallet is blocked",
        });
        return;
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "deposit",
        amount,
        fromWalletId: wallet._id,
        fromUserId: userId,
        initiatedBy: userId,
        status: "completed",
        description: "Add money to wallet",
      });

      await transaction.save();

      // Update wallet balance
      await wallet.addMoney(amount);

      const response: ApiResponse = {
        success: true,
        message: "Money added successfully",
        data: {
          transaction: transaction,
          newBalance: wallet.balance,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Add money error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Withdraw money from wallet (for users)
export const withdrawMoney = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ৳1"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount } = req.body;
      const userId = req.user!.userId;

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
        return;
      }

      if (wallet.isBlocked) {
        res.status(403).json({
          success: false,
          message: "Wallet is blocked",
        });
        return;
      }

      if (!wallet.canPerformTransaction(amount)) {
        res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
        return;
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "withdraw",
        amount,
        fromWalletId: wallet._id,
        fromUserId: userId,
        initiatedBy: userId,
        status: "completed",
        description: "Withdraw money from wallet",
      });

      await transaction.save();

      // Update wallet balance
      await wallet.withdrawMoney(amount);

      const response: ApiResponse = {
        success: true,
        message: "Money withdrawn successfully",
        data: {
          transaction: transaction,
          newBalance: wallet.balance,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Withdraw money error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Send money to another user
export const sendMoney = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ৳1"),
  body("toUserId").isMongoId().withMessage("Valid user ID is required"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount, toUserId } = req.body;
      const fromUserId = req.user!.userId;

      if (fromUserId === toUserId) {
        res.status(400).json({
          success: false,
          message: "Cannot send money to yourself",
        });
        return;
      }

      // Check if recipient exists
      const recipient = await User.findById(toUserId);
      if (!recipient || !recipient.isActive) {
        res.status(404).json({
          success: false,
          message: "Recipient not found or inactive",
        });
        return;
      }

      const fromWallet = await Wallet.findOne({ userId: fromUserId });
      const toWallet = await Wallet.findOne({ userId: toUserId });

      if (!fromWallet || !toWallet) {
        res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
        return;
      }

      if (fromWallet.isBlocked || toWallet.isBlocked) {
        res.status(403).json({
          success: false,
          message: "One of the wallets is blocked",
        });
        return;
      }

      if (!fromWallet.canPerformTransaction(amount)) {
        res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
        return;
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "transfer",
        amount,
        fromWalletId: fromWallet._id,
        toWalletId: toWallet._id,
        fromUserId,
        toUserId,
        initiatedBy: fromUserId,
        status: "completed",
        description: `Transfer to ${recipient.name}`,
      });

      await transaction.save();

      // Update both wallets
      await fromWallet.transferMoney(amount);
      await toWallet.addMoney(amount);

      const response: ApiResponse = {
        success: true,
        message: "Money sent successfully",
        data: {
          transaction: transaction,
          newBalance: fromWallet.balance,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Send money error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Agent cash-in (add money to user's wallet)
export const cashIn = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ৳1"),
  body("userId").isMongoId().withMessage("Valid user ID is required"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount, userId } = req.body;
      const agentId = req.user!.userId;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        res.status(404).json({
          success: false,
          message: "User not found or inactive",
        });
        return;
      }

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: "User wallet not found",
        });
        return;
      }

      if (wallet.isBlocked) {
        res.status(403).json({
          success: false,
          message: "User wallet is blocked",
        });
        return;
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "cash-in",
        amount,
        fromWalletId: wallet._id,
        toWalletId: wallet._id,
        fromUserId: userId,
        toUserId: userId,
        initiatedBy: agentId,
        status: "completed",
        description: `Cash-in by agent`,
      });

      await transaction.save();

      // Update wallet balance
      await wallet.addMoney(amount);

      const response: ApiResponse = {
        success: true,
        message: "Cash-in successful",
        data: {
          transaction: transaction,
          newBalance: wallet.balance,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Cash-in error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Agent cash-out (withdraw money from user's wallet)
export const cashOut = [
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ৳1"),
  body("userId").isMongoId().withMessage("Valid user ID is required"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount, userId } = req.body;
      const agentId = req.user!.userId;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        res.status(404).json({
          success: false,
          message: "User not found or inactive",
        });
        return;
      }

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: "User wallet not found",
        });
        return;
      }

      if (wallet.isBlocked) {
        res.status(403).json({
          success: false,
          message: "User wallet is blocked",
        });
        return;
      }

      if (!wallet.canPerformTransaction(amount)) {
        res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
        return;
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "cash-out",
        amount,
        fromWalletId: wallet._id,
        toWalletId: wallet._id,
        fromUserId: userId,
        toUserId: userId,
        initiatedBy: agentId,
        status: "completed",
        description: `Cash-out by agent`,
      });

      await transaction.save();

      // Update wallet balance
      await wallet.withdrawMoney(amount);

      const response: ApiResponse = {
        success: true,
        message: "Cash-out successful",
        data: {
          transaction: transaction,
          newBalance: wallet.balance,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Cash-out error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Admin: Get all wallets
export const getAllWallets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const wallets = await Wallet.find().populate(
      "userId",
      "name email phone role"
    );

    const response: ApiResponse = {
      success: true,
      message: "All wallets retrieved successfully",
      data: wallets,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get all wallets error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Block/unblock wallet
export const toggleWalletBlock = [
  body("walletId").isMongoId().withMessage("Valid wallet ID is required"),

  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { walletId } = req.body;

      const wallet = await Wallet.findById(walletId);
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
        return;
      }

      wallet.isBlocked = !wallet.isBlocked;
      await wallet.save();

      const response: ApiResponse = {
        success: true,
        message: `Wallet ${
          wallet.isBlocked ? "blocked" : "unblocked"
        } successfully`,
        data: wallet,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Toggle wallet block error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
