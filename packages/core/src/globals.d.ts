import "express";
import { RateLimitRecord } from "./interfaces";

declare global {
  namespace Express {
    interface Request {
      [key: string]: RateLimitRecord | undefined;
    }
  }
}
