import { Request, Response, NextFunction } from "express";
import { getIp, getTimestamp } from "./utils";
import { Store } from "./types/store.type";
import { RateLimiterOptions } from "./interfaces/rate-limiter-options.interface";

//ADD REDIS support
const store: Store = {};

export function rateLimiter(options: RateLimiterOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getIp(req);
    const currentTime = getTimestamp();
    const startTime = currentTime - options.ms * 1000;

    if (!store[ip]) {
      store[ip] = { count: 0, timestamp: currentTime };
    }

    if (store[ip].timestamp < startTime) {
      store[ip].count = 0;
      store[ip].timestamp = currentTime;
    }

    if (store[ip].count < options.maxRequest) {
      store[ip].count += 1;
      next();
    } else {
      res
        .status(420)
        .json({ message: "Too many requests, please try again later." });
    }
  };
}
