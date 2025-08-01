import { Router } from "express";
import {
  authenticate,
  requireAdmin,
  requireAgent,
  requireUser,
} from "../../middlewares/auth.middleware";
import {
  addMoney,
  cashIn,
  cashOut,
  getAllWallets,
  getWallet,
  sendMoney,
  toggleWalletBlock,
  withdrawMoney,
} from "./wallet.controller";

const router = Router();

// User routes
router.get("/me", authenticate, requireUser, getWallet);
router.post("/add-money", authenticate, requireUser, addMoney);
router.post("/withdraw", authenticate, requireUser, withdrawMoney);
router.post("/send-money", authenticate, requireUser, sendMoney);

// Agent routes
router.post("/cash-in", authenticate, requireAgent, cashIn);
router.post("/cash-out", authenticate, requireAgent, cashOut);

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllWallets);
router.patch("/toggle-block", authenticate, requireAdmin, toggleWalletBlock);

export default router;
