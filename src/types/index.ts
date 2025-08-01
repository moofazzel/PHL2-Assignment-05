export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "user" | "agent" | "admin";
  isActive: boolean;
  isApproved?: boolean; // For agents
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet {
  _id: string;
  userId: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  _id: string;
  type: "deposit" | "withdraw" | "transfer" | "cash-in" | "cash-out";
  amount: number;
  fee: number;
  commission?: number;
  fromWalletId: string;
  toWalletId?: string;
  fromUserId: string;
  toUserId?: string;
  initiatedBy: string; // userId of who initiated the transaction
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}
