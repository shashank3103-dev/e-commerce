import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { AppError } from "../utils/http";

const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: err.errors,
      });
    }
  };

export default validate;
