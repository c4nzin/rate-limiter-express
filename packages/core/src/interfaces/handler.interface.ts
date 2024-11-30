import { NextFunction, Request, Response } from "express";
import { RateLimiterOptions } from "./rate-limiter-options.interface";

export interface Handler {
  (
    req: Request,
    res: Response,
    next: NextFunction,
    options: RateLimiterOptions
  ): void;
}
