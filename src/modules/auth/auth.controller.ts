import { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";

export const register = [
  validateRequest(registerSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  },
];

export const login = [
  validateRequest(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  },
];
