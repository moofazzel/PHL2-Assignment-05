import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { ApiResponse } from "../types/common.interface";

export const validateRequest = (schema: ZodObject<any>) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
      }
      next(error);
    }
  };
};
