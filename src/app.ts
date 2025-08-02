import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import apiRoutes from "./routes/router";

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

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Wallet API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      wallets: "/api/wallets",
      transactions: "/api/transactions",
      users: "/api/users",
      health: "/health",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Wallet API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", apiRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
