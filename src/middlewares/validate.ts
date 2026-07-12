import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validates req.body, req.query, or req.params depending on the schema definition
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((err: any) => ({
          field: err.path[1], // points to the exact invalid field name
          message: err.message,
        })),
      });
    }
  };
};