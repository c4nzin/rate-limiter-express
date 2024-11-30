import { Request, Response, NextFunction } from "express";
import { RateLimiterOptions } from "./interfaces/rate-limiter-options.interface";
import { InMemoryStorage } from "./storages/in-memory.storage";
import { getIp, getTimestamp } from "./utils";
import { RateLimiter } from "./interfaces";

const inMemoryStorage = new InMemoryStorage();
let storageInstance: RateLimiter;

export function rateLimiter(options: RateLimiterOptions) {
  var storage = options.storage ?? inMemoryStorage;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!storageInstance) {
      try {
        storageInstance = await storage.initialize();
      } catch (error: any) {
        return handleError(req, res, error, options);
      }
    }

    try {
      const rateLimitPropName = options.requestPropertyName ?? "rateLimit";

      let key: string;

      if (options.keyGenerator && typeof options.keyGenerator === "function") {
        key = options.keyGenerator(req, res);
      } else {
        key = getIp(req);
      }

      var record = await storageInstance.getRateLimitRecord(key);

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
        record = await storageInstance.createRateLimitRecord({
          key,
          count: 0,
          timestamp: currentTime,
        });
        req[rateLimitPropName] = record;
      }

      if (startTime > record.timestamp) {
        record = await storageInstance.updateRateLimitRecord(
          key,
          currentTime,
          1
        );
        req[rateLimitPropName] = record;
        next();
      } else if (record.count < maxRequest) {
        record = await storageInstance.increment(record.key);
        req[rateLimitPropName] = record;
        next();
      } else {
        if (options.handler && typeof options.handler === "function") {
          return await options.handler(req, res, next, options);
        }
        res.status(options.statusCode ?? 429).send(message);
      }
    } catch (error) {
      handleError(req, res, error, options);
    }
  };
}

function handleError(
  req: Request,
  res: Response,
  error: any,
  options: RateLimiterOptions
) {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);

  if (options.errorHandler && typeof options.errorHandler === "function") {
    return options.errorHandler(req, res);
  }
  return res.status(500).json({ statusCode: 500, message });
}
