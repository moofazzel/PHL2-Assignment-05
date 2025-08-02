import { Router } from "express";
import {
  authenticate,
  requireAdmin,
  requireAgent,
  requireUser,
} from "../../middlewares/auth.middleware";
import {
  addMoneyController,
  cashInController,
  cashOutController,
  getAllWalletsController,
  getWalletController,
  sendMoneyController,
  toggleWalletBlockController,
  withdrawMoneyController,
} from "./wallet.controller";

const router = Router();

// User routes
router.get("/me", authenticate, requireUser, getWalletController);
router.post("/add-money", authenticate, requireUser, addMoneyController);
router.post("/withdraw", authenticate, requireUser, withdrawMoneyController);
router.post("/send-money", authenticate, requireUser, sendMoneyController);

// Agent routes
router.post("/cash-in", authenticate, requireAgent, cashInController);
router.post("/cash-out", authenticate, requireAgent, cashOutController);

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllWalletsController);
router.patch(
  "/toggle-block",
  authenticate,
  requireAdmin,
  toggleWalletBlockController
);

export default router;
