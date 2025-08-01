import { Router } from "express";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware";
import {
  getAllAgents,
  getAllUsers,
  getUserStats,
  toggleAgentApproval,
  toggleUserStatus,
} from "./user.controller";

const router = Router();

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllUsers);
router.get("/agents", authenticate, requireAdmin, getAllAgents);
router.patch(
  "/toggle-agent-approval",
  authenticate,
  requireAdmin,
  toggleAgentApproval
);
router.patch(
  "/toggle-user-status",
  authenticate,
  requireAdmin,
  toggleUserStatus
);
router.get("/stats", authenticate, requireAdmin, getUserStats);

export default router;
