import { UserListResponse, UserStats } from "./user.interface";
import { User } from "./user.model";

export const getAllUsers = async (query: any): Promise<UserListResponse> => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    role,
    isActive,
    isApproved,
  } = query;
  const skip = (page - 1) * limit;

  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const filterOptions: any = {};
  if (role) filterOptions.role = role;
  if (isActive !== undefined) filterOptions.isActive = isActive;
  if (isApproved !== undefined) filterOptions.isApproved = isApproved;

  const users = await User.find(filterOptions)
    .select("-password")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filterOptions);

  return {
    success: true,
    message: "Users retrieved successfully",
    data: {
      users,
      total,
      page,
      limit,
    },
  };
};

export const getAllAgents = async (query: any): Promise<UserListResponse> => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
    isApproved,
  } = query;
  const skip = (page - 1) * limit;

  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const filterOptions: any = { role: "agent" };
  if (isActive !== undefined) filterOptions.isActive = isActive;
  if (isApproved !== undefined) filterOptions.isApproved = isApproved;

  const agents = await User.find(filterOptions)
    .select("-password")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filterOptions);

  return {
    success: true,
    message: "Agents retrieved successfully",
    data: {
      users: agents,
      total,
      page,
      limit,
    },
  };
};

export const toggleUserStatus = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("Cannot modify admin status");
  }

  user.isActive = !user.isActive;
  await user.save();

  const status = user.isActive ? "activated" : "blocked";

  return {
    success: true,
    message: `User ${status} successfully`,
  };
};

export const toggleAgentApproval = async (
  agentId: string
): Promise<{ success: boolean; message: string }> => {
  const agent = await User.findById(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  if (agent.role !== "agent") {
    throw new Error("User is not an agent");
  }

  agent.isApproved = !agent.isApproved;
  await agent.save();

  const status = agent.isApproved ? "approved" : "suspended";

  return {
    success: true,
    message: `Agent ${status} successfully`,
  };
};

export const getUserStats = async (): Promise<{
  success: boolean;
  message: string;
  data: UserStats;
}> => {
  const [
    totalUsers,
    totalAgents,
    activeUsers,
    activeAgents,
    approvedAgents,
    blockedUsers,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "agent" }),
    User.countDocuments({ role: "user", isActive: true }),
    User.countDocuments({ role: "agent", isActive: true }),
    User.countDocuments({ role: "agent", isApproved: true }),
    User.countDocuments({ isActive: false }),
  ]);

  const stats: UserStats = {
    totalUsers,
    totalAgents,
    activeUsers,
    activeAgents,
    approvedAgents,
    blockedUsers,
  };

  return {
    success: true,
    message: "User statistics retrieved successfully",
    data: stats,
  };
};
