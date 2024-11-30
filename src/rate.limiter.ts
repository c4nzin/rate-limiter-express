import { Request, Response, NextFunction } from "express";
import { getIp, getTimestamp } from "./utils";
import { RateLimiterOptions } from "./interfaces/rate-limiter-options.interface";
import { InMemoryStorage } from "./storages/in-memory.storage";

const inMemoryStorage = new InMemoryStorage();

export function rateLimiter(options: RateLimiterOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = getIp(req);
    const currentTime = getTimestamp();
    const startTime = currentTime - options.ms;
    var storage = options.storage ?? inMemoryStorage;

    var record = await storage.getRateLimitRecord(ip);

    if (!record) {
      record = await storage.createRateLimitRecord({
        key: ip,
        count: 0,
        timestamp: currentTime,
      });
    }

    if (startTime > record.timestamp) {
      record = await storage.updateRateLimitRecord(ip, currentTime, 1);
      return next();
    }

    if (record.count < options.maxRequest) {
      record = await storage.increment(record.key);
      return next();
    }

    res
      .status(420)
      .json({ message: "Too many requests, please try again later." });
  };
}
