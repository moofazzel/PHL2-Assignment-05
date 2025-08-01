import { Request } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: "user" | "agent" | "admin";
    isActive: boolean;
    isApproved?: boolean;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
