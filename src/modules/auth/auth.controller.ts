import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiResponse } from "../../types";
import { generateToken } from "../../utils/jwt";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

export const register = [
  // Validation middleware
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("name").isLength({ min: 2 }),
  body("phone").matches(/^(\+880|880|0)?1[3456789]\d{8}$/),
  body("role").optional().isIn(["user", "agent"]),

  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { email, password, name, phone, role = "user" } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        });
        return;
      }

      // Create user
      const user = new User({
        email,
        password,
        name,
        phone,
        role,
        isApproved: role === "agent" ? false : undefined, // Agents need approval
      });

      await user.save();

      // Create wallet for the user
      const wallet = new Wallet({
        userId: user._id,
        balance: 50, // Initial balance of ৳50
      });

      await wallet.save();

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const response: ApiResponse = {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            isApproved: user.isApproved,
          },
          wallet: {
            _id: wallet._id,
            balance: wallet.balance,
            isBlocked: wallet.isBlocked,
          },
          token,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

export const login = [
  // Validation middleware
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),

  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      // For agents, check if approved
      if (user.role === "agent" && !user.isApproved) {
        res.status(403).json({
          success: false,
          message: "Agent account is not approved yet",
        });
        return;
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Get user's wallet
      const wallet = await Wallet.findOne({ userId: user._id });

      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            isApproved: user.isApproved,
          },
          wallet: wallet
            ? {
                _id: wallet._id,
                balance: wallet.balance,
                isBlocked: wallet.isBlocked,
              }
            : null,
          token,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
