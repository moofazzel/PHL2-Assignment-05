import mongoose, { Schema } from "mongoose";
import { IWalletDocument } from "./wallet.interface";

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
      default: 50,
      min: [0, "Balance cannot be negative"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Check if wallet can perform transaction
walletSchema.methods.canPerformTransaction = function (
  amount: number
): boolean {
  return this.balance >= amount && !this.isBlocked;
};

// Add money to wallet
walletSchema.methods.addMoney = async function (amount: number): Promise<void> {
  this.balance += amount;
  await this.save();
};

// Withdraw money from wallet
walletSchema.methods.withdrawMoney = async function (
  amount: number
): Promise<void> {
  if (!this.canPerformTransaction(amount)) {
    throw new Error("Insufficient balance or wallet is blocked");
  }
  this.balance -= amount;
  await this.save();
};

// Transfer money from wallet (for fees, etc.)
walletSchema.methods.transferMoney = async function (
  amount: number
): Promise<void> {
  if (!this.canPerformTransaction(amount)) {
    throw new Error("Insufficient balance or wallet is blocked");
  }
  this.balance -= amount;
  await this.save();
};

// Indexes
walletSchema.index({ userId: 1 });
walletSchema.index({ isBlocked: 1 });

export const Wallet = mongoose.model<IWalletDocument>("Wallet", walletSchema);
