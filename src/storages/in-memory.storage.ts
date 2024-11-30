import { RateLimitRecord } from "../interfaces/rate-limit-record.interface";
import { RateLimiter } from "../interfaces/rate-limiter.interface";

export class InMemoryStorage implements RateLimiter {
  private store: RateLimitRecord[] = [];

  public async getRateLimitRecord(
    key: string
  ): Promise<RateLimitRecord | undefined> {
    return this.store.find((x) => x.key === key);
  }

  public async createRateLimitRecord(
    record: RateLimitRecord
  ): Promise<RateLimitRecord> {
    let index = this.store.push(record);
    return this.store[index - 1];
  }

  public async updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): Promise<RateLimitRecord> {
    let index = this.store.findIndex((x) => x.key === key);
    this.store[index].count = count;
    this.store[index].timestamp = timestamp;

    return this.store[index];
  }

  public async increment(key: string): Promise<RateLimitRecord> {
    let index = this.store.findIndex((x) => x.key === key);
    this.store[index].count += 1;
    return this.store[index];
  }
}
