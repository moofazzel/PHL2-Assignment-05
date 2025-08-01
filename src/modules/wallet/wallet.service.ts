import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { WalletListResponse, WalletResponse } from "./wallet.interface";
import { Wallet } from "./wallet.model";

export class WalletService {
  static async getWallet(userId: string): Promise<WalletResponse> {
    const wallet = await Wallet.findOne({ userId }).populate(
      "userId",
      "name email phone"
    );

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return {
      success: true,
      message: "Wallet retrieved successfully",
      data: { wallet },
    };
  }

  static async addMoney(
    userId: string,
    amount: number
  ): Promise<WalletResponse> {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.isBlocked) {
      throw new Error("Wallet is blocked. Cannot perform transactions.");
    }

    // Add money to wallet
    await wallet.addMoney(amount);

    // Create transaction record
    const transaction = new Transaction({
      type: "deposit",
      amount,
      fee: 0, // No fee for deposits
      commission: 0,
      fromWalletId: wallet._id,
      fromUserId: userId,
      initiatedBy: userId,
      status: "completed",
      description: `Added ৳${amount} to wallet`,
    });

    await transaction.save();

    return {
      success: true,
      message: `Successfully added ৳${amount} to wallet`,
      data: { wallet },
    };
  }

  static async withdrawMoney(
    userId: string,
    amount: number
  ): Promise<WalletResponse> {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.isBlocked) {
      throw new Error("Wallet is blocked. Cannot perform transactions.");
    }

    if (!wallet.canPerformTransaction(amount)) {
      throw new Error("Insufficient balance");
    }

    // Withdraw money from wallet
    await wallet.withdrawMoney(amount);

    // Create transaction record
    const transaction = new Transaction({
      type: "withdraw",
      amount,
      fee: 0, // No fee for withdrawals
      commission: 0,
      fromWalletId: wallet._id,
      fromUserId: userId,
      initiatedBy: userId,
      status: "completed",
      description: `Withdrew ৳${amount} from wallet`,
    });

    await transaction.save();

    return {
      success: true,
      message: `Successfully withdrew ৳${amount} from wallet`,
      data: { wallet },
    };
  }

  static async sendMoney(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<WalletResponse> {
    // Validate recipient
    if (fromUserId === toUserId) {
      throw new Error("Cannot send money to yourself");
    }

    const recipient = await User.findById(toUserId);
    if (!recipient || recipient.role !== "user") {
      throw new Error("Invalid recipient. Only users can receive money.");
    }

    const fromWallet = await Wallet.findOne({ userId: fromUserId });
    const toWallet = await Wallet.findOne({ userId: toUserId });

    if (!fromWallet || !toWallet) {
      throw new Error("Wallet not found");
    }

    if (fromWallet.isBlocked || toWallet.isBlocked) {
      throw new Error("Wallet is blocked. Cannot perform transactions.");
    }

    if (!fromWallet.canPerformTransaction(amount)) {
      throw new Error("Insufficient balance");
    }

    // Calculate fee (1% of amount)
    const fee = Math.ceil(amount * 0.01);
    const totalAmount = amount + fee;

    if (!fromWallet.canPerformTransaction(totalAmount)) {
      throw new Error("Insufficient balance to cover amount and fee");
    }

    // Perform transfer
    await fromWallet.transferMoney(totalAmount);
    await toWallet.addMoney(amount);

    // Create transaction record
    const transaction = new Transaction({
      type: "transfer",
      amount,
      fee,
      commission: 0,
      fromWalletId: fromWallet._id,
      toWalletId: toWallet._id,
      fromUserId,
      toUserId,
      initiatedBy: fromUserId,
      status: "completed",
      description: `Sent ৳${amount} to ${recipient.name}`,
    });

    await transaction.save();

    return {
      success: true,
      message: `Successfully sent ৳${amount} to ${recipient.name}`,
      data: { wallet: fromWallet },
    };
  }

  static async cashIn(
    agentId: string,
    userId: string,
    amount: number
  ): Promise<WalletResponse> {
    const agent = await User.findById(agentId);
    const user = await User.findById(userId);

    if (!agent || agent.role !== "agent") {
      throw new Error("Invalid agent");
    }

    if (!user || user.role !== "user") {
      throw new Error("Invalid user. Only users can receive cash-in.");
    }

    const userWallet = await Wallet.findOne({ userId });

    if (!userWallet) {
      throw new Error("User wallet not found");
    }

    if (userWallet.isBlocked) {
      throw new Error("User wallet is blocked. Cannot perform transactions.");
    }

    // Add money to user wallet
    await userWallet.addMoney(amount);

    // Calculate commission (0.5% of amount)
    const commission = Math.ceil(amount * 0.005);

    // Create transaction record
    const transaction = new Transaction({
      type: "cash-in",
      amount,
      fee: 0,
      commission,
      fromWalletId: userWallet._id,
      toWalletId: userWallet._id,
      fromUserId: userId,
      toUserId: userId,
      initiatedBy: agentId,
      status: "completed",
      description: `Agent ${agent.name} added ৳${amount} to user wallet`,
    });

    await transaction.save();

    return {
      success: true,
      message: `Successfully added ৳${amount} to user wallet`,
      data: { wallet: userWallet },
    };
  }

  static async cashOut(
    agentId: string,
    userId: string,
    amount: number
  ): Promise<WalletResponse> {
    const agent = await User.findById(agentId);
    const user = await User.findById(userId);

    if (!agent || agent.role !== "agent") {
      throw new Error("Invalid agent");
    }

    if (!user || user.role !== "user") {
      throw new Error("Invalid user. Only users can perform cash-out.");
    }

    const userWallet = await Wallet.findOne({ userId });

    if (!userWallet) {
      throw new Error("User wallet not found");
    }

    if (userWallet.isBlocked) {
      throw new Error("User wallet is blocked. Cannot perform transactions.");
    }

    if (!userWallet.canPerformTransaction(amount)) {
      throw new Error("Insufficient balance");
    }

    // Withdraw money from user wallet
    await userWallet.withdrawMoney(amount);

    // Calculate commission (0.5% of amount)
    const commission = Math.ceil(amount * 0.005);

    // Create transaction record
    const transaction = new Transaction({
      type: "cash-out",
      amount,
      fee: 0,
      commission,
      fromWalletId: userWallet._id,
      toWalletId: userWallet._id,
      fromUserId: userId,
      toUserId: userId,
      initiatedBy: agentId,
      status: "completed",
      description: `Agent ${agent.name} withdrew ৳${amount} from user wallet`,
    });

    await transaction.save();

    return {
      success: true,
      message: `Successfully withdrew ৳${amount} from user wallet`,
      data: { wallet: userWallet },
    };
  }

  static async getAllWallets(query: any): Promise<WalletListResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const wallets = await Wallet.find()
      .populate("userId", "name email phone role")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Wallet.countDocuments();

    return {
      success: true,
      message: "Wallets retrieved successfully",
      data: {
        wallets,
        total,
        page,
        limit,
      },
    };
  }

  static async toggleWalletBlock(walletId: string): Promise<WalletResponse> {
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.isBlocked = !wallet.isBlocked;
    await wallet.save();

    const status = wallet.isBlocked ? "blocked" : "unblocked";

    return {
      success: true,
      message: `Wallet ${status} successfully`,
      data: { wallet },
    };
  }
}
