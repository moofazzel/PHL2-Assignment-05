import { Types } from "mongoose";

export interface IWallet {
  _id: string;
  userId: Types.ObjectId;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletDocument extends IWallet, Document {
  canPerformTransaction(amount: number): boolean;
  addMoney(amount: number): Promise<void>;
  withdrawMoney(amount: number): Promise<void>;
  transferMoney(amount: number): Promise<void>;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet: IWallet;
  };
}

export interface WalletListResponse {
  success: boolean;
  message: string;
  data: {
    wallets: IWallet[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AddMoneyRequest {
  amount: number;
}

export interface WithdrawMoneyRequest {
  amount: number;
}

export interface SendMoneyRequest {
  amount: number;
  toUserId: string;
}

export interface CashInRequest {
  amount: number;
  userId: string;
}

export interface CashOutRequest {
  amount: number;
  userId: string;
}

export interface ToggleWalletBlockRequest {
  walletId: string;
}
