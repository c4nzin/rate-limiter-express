import { RateLimiter, RateLimitRecord } from "@canmertinyo/rate-limiter-core";
import Memcached from "memcached";
import { promisify } from "util";

export class MemcachedStore implements RateLimiter {
  private memcached!: Memcached;

  constructor(
    private readonly server: string | string[],
    private readonly memcachedOptions: Memcached.options
  ) {}

  public async initialize(): Promise<RateLimiter> {
    try {
      this.memcached = new Memcached(this.server, this.memcachedOptions);
    } catch (error) {
      throw new Error("Failed to initialize Memcached.");
    }
    return this;
  }

  public async getRateLimitRecord(
    key: string
  ): Promise<RateLimitRecord | undefined> {
    const getAsync = promisify(this.memcached.get).bind(this.memcached);
    try {
      const record = await getAsync(key);
      return record ? (JSON.parse(record) as RateLimitRecord) : undefined;
    } catch (error) {
      throw new Error("Error getting rate limit record.");
    }
  }

  public async createRateLimitRecord(
    record: RateLimitRecord
  ): Promise<RateLimitRecord> {
    const createAsync = promisify(this.memcached.set).bind(this.memcached);
    const getAsync = promisify(this.memcached.get).bind(this.memcached);
    try {
      const success = await createAsync(
        record.key,
        JSON.stringify(record),
        5000
      );
      if (success) {
        const storedRecord = await getAsync(record.key);
        if (storedRecord) {
          return JSON.parse(storedRecord) as RateLimitRecord;
        } else {
          throw new Error("Record not found.");
        }
      } else {
        throw new Error("Failed to create rate limit record.");
      }
    } catch (error) {
      throw new Error("Error creating rate limit record: " + error);
    }
  }

  public async updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): Promise<RateLimitRecord> {
    const getAsync = promisify(this.memcached.get).bind(this.memcached);
    const setAsync = promisify(this.memcached.set).bind(this.memcached);
    try {
      const existingRecord = await getAsync(key);
      if (!existingRecord) {
        throw new Error(`Record with key "${key}" not found.`);
      }
      const updatedRecord: RateLimitRecord = {
        ...JSON.parse(existingRecord),
        timestamp,
        count,
      };
      const success = await setAsync(key, JSON.stringify(updatedRecord), 5000);
      if (success) {
        return updatedRecord;
      } else {
        throw new Error(`Failed to update record with key "${key}".`);
      }
    } catch (error) {
      throw new Error("Error updating the rate limit record.");
    }
  }

  public async increment(key: string): Promise<RateLimitRecord> {
    const getAsync = promisify(this.memcached.get).bind(this.memcached);
    const setAsync = promisify(this.memcached.set).bind(this.memcached);
    try {
      const recordJSON = await getAsync(key);
      if (!recordJSON) {
        throw new Error("Record not found");
      }
      const record: RateLimitRecord = JSON.parse(recordJSON);
      const updatedRecord: RateLimitRecord = {
        ...record,
        count: record.count + 1,
      };
      const success = await setAsync(key, JSON.stringify(updatedRecord), 5000);
      if (success) {
        return updatedRecord;
      } else {
        throw new Error("Failed to update record");
      }
    } catch (error) {
      throw new Error("Failed to update record");
    }
  }
}
