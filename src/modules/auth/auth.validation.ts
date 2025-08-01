import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password cannot exceed 50 characters"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),
    phone: z
      .string()
      .regex(
        /^(\+880|880|0)?1[3456789]\d{8}$/,
        "Please enter a valid Bangladeshi phone number"
      )
      .trim(),
    role: z.enum(["user", "agent"]).optional().default("user"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterRequest = z.infer<typeof registerSchema>["body"];
export type LoginRequest = z.infer<typeof loginSchema>["body"];
