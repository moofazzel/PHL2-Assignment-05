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

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserStats {
  totalUsers: number;
  totalAgents: number;
  activeUsers: number;
  activeAgents: number;
  approvedAgents: number;
  blockedUsers: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ToggleUserStatusRequest {
  userId: string;
}

export interface ToggleAgentApprovalRequest {
  agentId: string;
}
