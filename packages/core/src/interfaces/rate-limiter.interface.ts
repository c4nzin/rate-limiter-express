import { RateLimitRecord } from "./rate-limit-record.interface";

export interface RateLimiter {
  initialize(): Promise<RateLimiter>;
  getRateLimitRecord(key: string): Promise<RateLimitRecord | undefined>;
  createRateLimitRecord(record: RateLimitRecord): Promise<RateLimitRecord>;
  updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): Promise<RateLimitRecord>;
  increment(key: string): Promise<RateLimitRecord>;
}
