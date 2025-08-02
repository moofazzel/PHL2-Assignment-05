import { Document, Types } from "mongoose";

export interface ITransaction {
  type: "deposit" | "withdraw" | "transfer" | "cash-in" | "cash-out";
  amount: number;
  fee: number;
  commission: number;
  fromWalletId: Types.ObjectId;
  toWalletId?: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId?: Types.ObjectId;
  initiatedBy: Types.ObjectId;
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction: ITransaction;
  };
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: {
    transactions: ITransaction[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  totalCommissions: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

export interface CommissionResponse {
  success: boolean;
  message: string;
  data: {
    commissions: ITransaction[];
    total: number;
    totalCommission: number;
    page: number;
    limit: number;
  };
}
