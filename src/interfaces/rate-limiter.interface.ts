import { RateLimitRecord } from "./rate-limit-record.interface";

export interface RateLimiter {
  getRateLimitRecord(key: string): RateLimitRecord | undefined;
  createRateLimitRecord(record: RateLimitRecord): RateLimitRecord;
  updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): RateLimitRecord;
  increment(key: string): RateLimitRecord;
}
