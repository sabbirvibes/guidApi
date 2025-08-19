import { Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const GlobalErrorHandler = (err: HttpError, req: Request, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  });
};
export default GlobalErrorHandler;
