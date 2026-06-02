/** Zod request-body validation middleware. */
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: { message: "Invalid request", details: result.error.flatten() },
      });
    }
    // Replace body with the parsed/validated value.
    req.body = result.data;
    next();
  };
}
