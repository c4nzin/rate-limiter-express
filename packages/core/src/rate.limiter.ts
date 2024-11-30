import { Request, Response, NextFunction } from "express";
import { RateLimiterOptions } from "./interfaces/rate-limiter-options.interface";
import { InMemoryStorage } from "./storages/in-memory.storage";
import { getIp, getTimestamp } from "./utils";

const inMemoryStorage = new InMemoryStorage();

export function rateLimiter(options: RateLimiterOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rateLimitPropName = options.requestPropertyName ?? "rateLimit";

    let key: string;

    if (options.keyGenerator && typeof options.keyGenerator === "function") {
      key = options.keyGenerator(req, res);
    } else {
      key = getIp(req);
    }

    var storage = options.storage ?? inMemoryStorage;
    var record = await storage.getRateLimitRecord(key);

    if (options.skip && typeof options.skip === "function") {
      const skip = await options.skip(req, res);

      if (skip) {
        req[rateLimitPropName] = record;
        return next();
      }
    }

    let maxRequest: number;

    if (typeof options.maxRequest === "function") {
      maxRequest = await options.maxRequest(req, res);
    } else {
      maxRequest = options.maxRequest as number;
    }

    let message: any;

    if (typeof options.message === "function") {
      message = options.message(req, res);
    } else {
      message = options.message;
    }

    const currentTime = getTimestamp();
    const startTime = currentTime - options.ms;

    if (!record) {
      record = await storage.createRateLimitRecord({
        key,
        count: 0,
        timestamp: currentTime,
      });
      req[rateLimitPropName] = record;
    }

    if (startTime > record.timestamp) {
      record = await storage.updateRateLimitRecord(key, currentTime, 1);
      req[rateLimitPropName] = record;
      next();
    } else if (record.count < maxRequest) {
      record = await storage.increment(record.key);
      req[rateLimitPropName] = record;
      next();
    } else {
      if (options.handler && typeof options.handler === "function") {
        await options.handler(req, res, next, options);
      } else {
        res.status(options.statusCode ?? 429).send(message);
      }
    }
  };
}
