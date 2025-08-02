import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import transactionRoutes from "../modules/transaction/transaction.routes";
import userRoutes from "../modules/user/user.routes";
import walletRoutes from "../modules/wallet/wallet.routes";

const router = Router();

// API routes
router.use("/auth", authRoutes);
router.use("/wallets", walletRoutes);
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);

export default router;
