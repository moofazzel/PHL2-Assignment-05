import { Router } from "express";
import {
  authenticate,
  requireAdmin,
  requireAgent,
  requireUser,
} from "../../middlewares/auth.middleware";
import {
  getAgentCommissionsController,
  getAllTransactionsController,
  getMyTransactionsController,
  getTransactionStatsController,
} from "./transaction.controller";

const router = Router();

// User routes
router.get("/my", authenticate, requireUser, getMyTransactionsController);

// Agent routes
router.get(
  "/commissions",
  authenticate,
  requireAgent,
  getAgentCommissionsController
);

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllTransactionsController);
router.get("/stats", authenticate, requireAdmin, getTransactionStatsController);

export default router;
