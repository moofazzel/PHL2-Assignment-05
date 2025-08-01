import {
  CommissionResponse,
  TransactionListResponse,
  TransactionStats,
} from "./transaction.interface";
import { Transaction } from "./transaction.model";

export class TransactionService {
  static async getMyTransactions(
    userId: string,
    query: any
  ): Promise<TransactionListResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      type,
      status,
    } = query;
    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const filterOptions: any = {
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (type) filterOptions.type = type;
    if (status) filterOptions.status = status;

    const transactions = await Transaction.find(filterOptions)
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email")
      .populate("initiatedBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filterOptions);

    return {
      success: true,
      message: "Transactions retrieved successfully",
      data: {
        transactions,
        total,
        page,
        limit,
      },
    };
  }

  static async getAgentCommissions(
    agentId: string,
    query: any
  ): Promise<CommissionResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const filterOptions: any = {
      initiatedBy: agentId,
      type: { $in: ["cash-in", "cash-out"] },
      commission: { $gt: 0 },
    };

    if (startDate || endDate) {
      filterOptions.createdAt = {};
      if (startDate) filterOptions.createdAt.$gte = new Date(startDate);
      if (endDate) filterOptions.createdAt.$lte = new Date(endDate);
    }

    const commissions = await Transaction.find(filterOptions)
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filterOptions);
    const totalCommission = await Transaction.aggregate([
      { $match: filterOptions },
      { $group: { _id: null, total: { $sum: "$commission" } } },
    ]);

    return {
      success: true,
      message: "Commission history retrieved successfully",
      data: {
        commissions,
        total,
        totalCommission: totalCommission[0]?.total || 0,
        page,
        limit,
      },
    };
  }

  static async getAllTransactions(
    query: any
  ): Promise<TransactionListResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      type,
      status,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const filterOptions: any = {};

    if (type) filterOptions.type = type;
    if (status) filterOptions.status = status;
    if (startDate || endDate) {
      filterOptions.createdAt = {};
      if (startDate) filterOptions.createdAt.$gte = new Date(startDate);
      if (endDate) filterOptions.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filterOptions)
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email")
      .populate("initiatedBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filterOptions);

    return {
      success: true,
      message: "All transactions retrieved successfully",
      data: {
        transactions,
        total,
        page,
        limit,
      },
    };
  }

  static async getTransactionStats(): Promise<{
    success: boolean;
    message: string;
    data: TransactionStats;
  }> {
    const [
      totalTransactions,
      totalAmount,
      totalFees,
      totalCommissions,
      pendingTransactions,
      completedTransactions,
      failedTransactions,
    ] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$fee" } } },
      ]),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$commission" } } },
      ]),
      Transaction.countDocuments({ status: "pending" }),
      Transaction.countDocuments({ status: "completed" }),
      Transaction.countDocuments({ status: "failed" }),
    ]);

    const stats: TransactionStats = {
      totalTransactions,
      totalAmount: totalAmount[0]?.total || 0,
      totalFees: totalFees[0]?.total || 0,
      totalCommissions: totalCommissions[0]?.total || 0,
      pendingTransactions,
      completedTransactions,
      failedTransactions,
    };

    return {
      success: true,
      message: "Transaction statistics retrieved successfully",
      data: stats,
    };
  }
}
