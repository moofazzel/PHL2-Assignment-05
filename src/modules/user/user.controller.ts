import { Request, Response } from "express";
import { ApiResponse } from "../../types";
import { User } from "./user.model";

// Admin: Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role as string;

    const filter: any = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    const response: ApiResponse = {
      success: true,
      message: "All users retrieved successfully",
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get all agents
export const getAllAgents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: "agent" });

    const response: ApiResponse = {
      success: true,
      message: "All agents retrieved successfully",
      data: {
        agents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get all agents error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Approve/suspend agent
export const toggleAgentApproval = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      res.status(400).json({
        success: false,
        message: "Agent ID is required",
      });
      return;
    }

    const agent = await User.findById(agentId);
    if (!agent) {
      res.status(404).json({
        success: false,
        message: "Agent not found",
      });
      return;
    }

    if (agent.role !== "agent") {
      res.status(400).json({
        success: false,
        message: "User is not an agent",
      });
      return;
    }

    agent.isApproved = !agent.isApproved;
    await agent.save();

    const response: ApiResponse = {
      success: true,
      message: `Agent ${
        agent.isApproved ? "approved" : "suspended"
      } successfully`,
      data: {
        agent: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          role: agent.role,
          isActive: agent.isActive,
          isApproved: agent.isApproved,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Toggle agent approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Toggle user active status
export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          isApproved: user.isApproved,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get user statistics
export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalAgents,
      totalAdmins,
      activeUsers,
      activeAgents,
      approvedAgents,
      pendingAgents,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "agent" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user", isActive: true }),
      User.countDocuments({ role: "agent", isActive: true }),
      User.countDocuments({ role: "agent", isApproved: true }),
      User.countDocuments({ role: "agent", isApproved: false }),
    ]);

    const response: ApiResponse = {
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        totalUsers,
        totalAgents,
        totalAdmins,
        activeUsers,
        activeAgents,
        approvedAgents,
        pendingAgents,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
