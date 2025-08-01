import { z } from "zod";

export const transactionQuerySchema = z.object({
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
    type: z
      .enum(["deposit", "withdraw", "transfer", "cash-in", "cash-out"])
      .optional(),
    status: z.enum(["pending", "completed", "failed", "reversed"]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const commissionQuerySchema = z.object({
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
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export type TransactionQueryRequest = z.infer<
  typeof transactionQuerySchema
>["query"];
export type CommissionQueryRequest = z.infer<
  typeof commissionQuerySchema
>["query"];
