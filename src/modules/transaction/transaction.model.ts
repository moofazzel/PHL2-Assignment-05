import mongoose, { Document, Schema } from "mongoose";
import { ITransaction } from "../../types";

export interface ITransactionDocument extends ITransaction, Document {}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer", "cash-in", "cash-out"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least ৳1"],
    },
    fee: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Fee cannot be negative"],
    },
    commission: {
      type: Number,
      default: 0,
      min: [0, "Commission cannot be negative"],
    },
    fromWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: [true, "From wallet is required"],
    },
    toWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: function () {
        return ["transfer", "cash-in", "cash-out"].includes(this.type);
      },
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From user is required"],
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return ["transfer", "cash-in", "cash-out"].includes(this.type);
      },
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Initiator is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "pending",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Calculate fee based on transaction type
transactionSchema.pre("save", function (next) {
  if (this.isModified("type") || this.isModified("amount")) {
    // Simple fee calculation - can be made more complex
    switch (this.type) {
      case "transfer":
        this.fee = Math.min(this.amount * 0.01, 10); // 1% or max ৳10
        break;
      case "withdraw":
        this.fee = Math.min(this.amount * 0.005, 5); // 0.5% or max ৳5
        break;
      case "cash-in":
      case "cash-out":
        this.fee = Math.min(this.amount * 0.01, 15); // 1% or max ৳15
        this.commission = Math.min(this.amount * 0.005, 10); // 0.5% or max ৳10
        break;
      default:
        this.fee = 0;
    }
  }
  next();
});

// Indexes for better query performance
transactionSchema.index({ fromUserId: 1, createdAt: -1 });
transactionSchema.index({ toUserId: 1, createdAt: -1 });
transactionSchema.index({ initiatedBy: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model<ITransactionDocument>(
  "Transaction",
  transactionSchema
);
