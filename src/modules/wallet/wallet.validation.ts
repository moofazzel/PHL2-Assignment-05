import { z } from "zod";

export const addMoneySchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least ৳1"),
  }),
});

export const withdrawMoneySchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least ৳1"),
  }),
});

export const sendMoneySchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least ৳1"),
    toUserId: z.string().min(1, "Recipient user ID is required"),
  }),
});

export const cashInSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least ৳1"),
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const cashOutSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount must be at least ৳1"),
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const toggleWalletBlockSchema = z.object({
  body: z.object({
    walletId: z.string().min(1, "Wallet ID is required"),
  }),
});

export const walletQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "1")),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "10")),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export type AddMoneyRequest = z.infer<typeof addMoneySchema>["body"];
export type WithdrawMoneyRequest = z.infer<typeof withdrawMoneySchema>["body"];
export type SendMoneyRequest = z.infer<typeof sendMoneySchema>["body"];
export type CashInRequest = z.infer<typeof cashInSchema>["body"];
export type CashOutRequest = z.infer<typeof cashOutSchema>["body"];
export type ToggleWalletBlockRequest = z.infer<
  typeof toggleWalletBlockSchema
>["body"];
export type WalletQueryRequest = z.infer<typeof walletQuerySchema>["query"];
