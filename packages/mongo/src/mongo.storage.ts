import { RateLimiter, RateLimitRecord } from "@canmertinyo/rate-limiter-core";
import mongoose from "mongoose";
import { RateLimitModel } from "./schemas/rate-limit.schema";

export class MongoStorage implements RateLimiter {
  private model: mongoose.Model<RateLimitRecord> = RateLimitModel;

  constructor(
    private readonly uri: string = "mongodb://localhost:27017/rate-limits",
    private readonly options?: mongoose.ConnectOptions
  ) {}

  public async initialize(): Promise<RateLimiter> {
    await mongoose.connect(this.uri, this.options);
    return this;
  }

  public async getRateLimitRecord(
    key: string
  ): Promise<RateLimitRecord | undefined> {
    const record = await this.model.findOne({ key });

    if (!record) return;

    var { _id, ...object } = record.toObject();

    return record ? object : undefined;
  }

  public async createRateLimitRecord(
    record: RateLimitRecord
  ): Promise<RateLimitRecord> {
    const newRecord = await this.model.create(record);
    newRecord.save();

    var { _id, ...object } = newRecord.toObject();

    return object as RateLimitRecord;
  }

  public async updateRateLimitRecord(
    key: string,
    timestamp: number,
    count: number
  ): Promise<RateLimitRecord> {
    const record = await this.model.findOneAndUpdate(
      { key },
      {
        timestamp,
        count,
      },
      {
        new: true,
      }
    );

    if (!record) {
      throw new Error("No record found.");
    }

    var { _id, ...object } = record.toObject();

    return object as RateLimitRecord;
  }

  public async increment(key: string): Promise<RateLimitRecord> {
    const record = await this.model.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      {
        new: true,
      }
    );

    if (!record) {
      throw new Error("No record found to increment.");
    }

    var { _id, ...object } = record.toObject();

    return object as RateLimitRecord;
  }
}
