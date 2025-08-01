import { Request, Response } from "express";
import { ApiResponse, AuthRequest } from "../../types";
import { Transaction } from "./transaction.model";

// Get user's transaction history
export const getMyTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId },
        { initiatedBy: userId },
      ],
    })
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email")
      .populate("initiatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({
      $or: [
        { fromUserId: userId },
        { toUserId: userId },
        { initiatedBy: userId },
      ],
    });

    const response: ApiResponse = {
      success: true,
      message: "Transaction history retrieved successfully",
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get agent's commission history
export const getAgentCommissions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      initiatedBy: agentId,
      type: { $in: ["cash-in", "cash-out"] },
    })
      .populate("fromUserId", "name email phone")
      .populate("toUserId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({
      initiatedBy: agentId,
      type: { $in: ["cash-in", "cash-out"] },
    });

    // Calculate total commission
    const totalCommission = transactions.reduce((sum, transaction) => {
      return sum + (transaction.commission || 0);
    }, 0);

    const response: ApiResponse = {
      success: true,
      message: "Commission history retrieved successfully",
      data: {
        transactions,
        totalCommission,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get agent commissions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get all transactions
export const getAllTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .populate("fromUserId", "name email phone role")
      .populate("toUserId", "name email phone role")
      .populate("initiatedBy", "name email phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments();

    const response: ApiResponse = {
      success: true,
      message: "All transactions retrieved successfully",
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get transaction statistics
export const getTransactionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const [
      totalTransactions,
      todayTransactions,
      thisMonthTransactions,
      totalAmount,
      todayAmount,
      thisMonthAmount,
      totalFees,
      totalCommissions,
    ] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ createdAt: { $gte: today } }),
      Transaction.countDocuments({ createdAt: { $gte: thisMonth } }),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$fee" } } },
      ]),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$commission" } } },
      ]),
    ]);

    const response: ApiResponse = {
      success: true,
      message: "Transaction statistics retrieved successfully",
      data: {
        totalTransactions,
        todayTransactions,
        thisMonthTransactions,
        totalAmount: totalAmount[0]?.total || 0,
        todayAmount: todayAmount[0]?.total || 0,
        thisMonthAmount: thisMonthAmount[0]?.total || 0,
        totalFees: totalFees[0]?.total || 0,
        totalCommissions: totalCommissions[0]?.total || 0,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
