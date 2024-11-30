import Redis from "ioredis";
import { RateLimiter, RateLimitRecord, RedisConfig } from "../interfaces";

export class RedisStorage implements RateLimiter {
  private redis: Redis;

  constructor(redisConfig: RedisConfig) {
    const { host, port, db, password, username } = redisConfig;

    const resolvedPort = port ? port : 6379;

    this.redis = new Redis({
      host,
      port: resolvedPort,
      db,
      password,
      username,
    });
  }

  public async getRateLimitRecord(
    key: string
  ): Promise<RateLimitRecord | undefined> {
    const data = await this.redis.get(key);
    return data ? (JSON.parse(data) as RateLimitRecord) : undefined;
  }

  public async createRateLimitRecord(
    record: RateLimitRecord
  ): Promise<RateLimitRecord> {
    //json objesine döndürmeden başka bir yol gibi..
    await this.redis.set(record.key, JSON.stringify(record));
    return record;
  }

  public async updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): Promise<RateLimitRecord> {
    const record = await this.getRateLimitRecord(key);
    if (!record) throw new Error("Record not found");

    const updatedRecord: RateLimitRecord = {
      ...record,
      count,
      timestamp,
    };
    await this.redis.set(key, JSON.stringify(updatedRecord));
    return updatedRecord;
  }

  public async increment(key: string): Promise<RateLimitRecord> {
    const record = await this.getRateLimitRecord(key);
    if (!record) throw new Error("Record not found");

    const updatedRecord: RateLimitRecord = {
      ...record,
      count: record.count + 1,
    };
    await this.redis.set(key, JSON.stringify(updatedRecord));
    return updatedRecord;
  }
}
