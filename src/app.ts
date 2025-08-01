import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import userRoutes from "./modules/user/user.routes";
import walletRoutes from "./modules/wallet/wallet.routes";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Wallet API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
