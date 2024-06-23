import { Request, Response, NextFunction } from "express";

interface CustomError extends SyntaxError {
  status: number;
  body: never;
};

/**
 * Middleware to check for JSON parsing errors in the request body.
 */
const checkJSON = (err: CustomError, req: Request, res: Response, next: NextFunction): Response<unknown, Record<string, unknown>> => {
  if (err instanceof SyntaxError && "status" in err && typeof err.status === "number" && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON" });
  };
  next();
};

export default checkJSON;