import { Request, Response, NextFunction } from "express";
import { getIp, getTimestamp } from "./utils";
import { Store } from "./types/store.type";
import { RateLimiterOptions } from "./interfaces/rate-limiter-options.interface";

export function rateLimiter(options: RateLimiterOptions) {
  var storage = options.storage || ({} as IRateLimiter);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getIp(req);
    const currentTime = getTimestamp();
    const startTime = currentTime - options.ms;

    var record = storage.getRateLimitRecord(ip);

    if (!record || record.timestamp < startTime) {
      storage.setRateLimitRecord({ count: 1, timestamp: currentTime });
    }

    if (record.count < options.maxRequest) {
      storage.increment();
      next();
    } else {
      res
        .status(420)
        .json({ message: "Too many requests, please try again later." });
    }
  };
}

export interface IRateLimitRecord {
  key: string;
  count: number;
  timestamp: number;
}

export interface IRateLimiter {
  getRateLimitRecord(key: string): IRateLimitRecord | undefined;
  setRateLimitRecord(record: IRateLimitRecord): void;
  increment(): void;
}
