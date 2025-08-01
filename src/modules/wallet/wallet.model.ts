import mongoose, { Document, Schema } from "mongoose";
import { IWallet } from "../../types";

export interface IWalletDocument extends IWallet, Document {
  canPerformTransaction(amount: number): boolean;
  addMoney(amount: number): Promise<void>;
  withdrawMoney(amount: number): Promise<void>;
  transferMoney(amount: number): Promise<void>;
}

const walletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 50, // Initial balance of ৳50
      min: [0, "Balance cannot be negative"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Check if wallet can perform transaction
walletSchema.methods.canPerformTransaction = function (
  amount: number
): boolean {
  if (this.isBlocked) {
    return false;
  }
  return this.balance >= amount;
};

// Add money to wallet
walletSchema.methods.addMoney = async function (amount: number): Promise<void> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }
  this.balance += amount;
  await this.save();
};

// Withdraw money from wallet
walletSchema.methods.withdrawMoney = async function (
  amount: number
): Promise<void> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }
  if (!this.canPerformTransaction(amount)) {
    throw new Error("Insufficient balance or wallet is blocked");
  }
  this.balance -= amount;
  await this.save();
};

// Transfer money from wallet (for transfer transactions)
walletSchema.methods.transferMoney = async function (
  amount: number
): Promise<void> {
  await this.withdrawMoney(amount);
};

// Index for better query performance
walletSchema.index({ userId: 1 });
walletSchema.index({ isBlocked: 1 });

export const Wallet = mongoose.model<IWalletDocument>("Wallet", walletSchema);
