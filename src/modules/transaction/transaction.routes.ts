import { Router } from "express";
import {
  authenticate,
  requireAdmin,
  requireAgent,
  requireUser,
} from "../../middlewares/auth.middleware";
import {
  getAgentCommissions,
  getAllTransactions,
  getMyTransactions,
  getTransactionStats,
} from "./transaction.controller";

const router = Router();

// User routes
router.get("/my", authenticate, requireUser, getMyTransactions);

// Agent routes
router.get("/commissions", authenticate, requireAgent, getAgentCommissions);

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllTransactions);
router.get("/stats", authenticate, requireAdmin, getTransactionStats);

export default router;
