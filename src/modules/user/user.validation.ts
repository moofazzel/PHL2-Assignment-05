import { z } from "zod";

export const toggleUserStatusSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const toggleAgentApprovalSchema = z.object({
  body: z.object({
    agentId: z.string().min(1, "Agent ID is required"),
  }),
});

export const userQuerySchema = z.object({
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
    role: z.enum(["user", "agent", "admin"]).optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    isApproved: z
      .string()
      .optional()
      .transform((val) => val === "true"),
  }),
});

export type ToggleUserStatusRequest = z.infer<
  typeof toggleUserStatusSchema
>["body"];
export type ToggleAgentApprovalRequest = z.infer<
  typeof toggleAgentApprovalSchema
>["body"];
export type UserQueryRequest = z.infer<typeof userQuerySchema>["query"];
