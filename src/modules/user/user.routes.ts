import { Router } from "express";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware";
import {
  getAllAgentsController,
  getAllUsersController,
  getUserStatsController,
  toggleAgentApprovalController,
  toggleUserStatusController,
} from "./user.controller";

const router = Router();

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllUsersController);
router.get("/agents", authenticate, requireAdmin, getAllAgentsController);
router.patch(
  "/toggle-agent-approval",
  authenticate,
  requireAdmin,
  toggleAgentApprovalController
);
router.patch(
  "/toggle-user-status",
  authenticate,
  requireAdmin,
  toggleUserStatusController
);
router.get("/stats", authenticate, requireAdmin, getUserStatsController);

export default router;
