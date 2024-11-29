import { RateLimitRecord } from "../interfaces/rate-limit-record.interface";
import { RateLimiter } from "../interfaces/rate-limiter.interface";

export class InMemoryStorage implements RateLimiter {
  private store: RateLimitRecord[] = [];

  getRateLimitRecord(key: string): RateLimitRecord | undefined {
    return this.store.find((x) => x.key === key);
  }

  createRateLimitRecord(record: RateLimitRecord): RateLimitRecord {
    var index = this.store.push(record);
    return this.store[index - 1];
  }

  updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): RateLimitRecord {
    var index = this.store.findIndex((x) => x.key === key);
    this.store[index].count = count;
    this.store[index].timestamp = timestamp;

    return this.store[index];
  }

  increment(key: string): RateLimitRecord {
    var index = this.store.findIndex((x) => x.key === key);
    this.store[index].count += 1;
    return this.store[index];
  }
}
