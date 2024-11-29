import { IRateLimiter, IRateLimitRecord } from "./rate.limiter";

export class InMemoryStorage implements IRateLimiter {
  private store: IRateLimitRecord[] = [];

  getRateLimitRecord(key: string): IRateLimitRecord | undefined {
    return this.store.find((x) => x.key === key);
  }
  setRateLimitRecord(record: IRateLimitRecord): void {
    throw new Error("Method not implemented.");
  }
}
