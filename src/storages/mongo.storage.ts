import { RateLimiter, RateLimitRecord } from "../interfaces";
import mongoose from "mongoose";
import { RateLimitModel } from "./schemas/rate-limit.schema";

export class MongoStorage implements RateLimiter {
  private model: mongoose.Model<RateLimitRecord>;

  constructor(public mongoDbUrl: string = "mongodb://127.0.0.1:27017") {
    mongoose
      .connect(mongoDbUrl)
      .then(() => {
        console.log("Db connected.");
      })
      .catch((err) => {
        console.log("Db failed to connect.", err);
      });

    this.model = RateLimitModel;
  }

  public async getRateLimitRecord(
    key: string
  ): Promise<RateLimitRecord | undefined> {
    const record = await this.model.findOne({ key });

    return record ? record.toObject() : undefined;
  }

  public async createRateLimitRecord(
    record: RateLimitRecord
  ): Promise<RateLimitRecord> {
    const newRecord = await this.model.create(record);
    newRecord.save();

    return newRecord.toObject() as RateLimitRecord;
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
    )!;

    if (!record) {
      throw new Error("No record found.");
    }

    return record.toObject() as RateLimitRecord;
  }

  public async increment(key: string): Promise<RateLimitRecord> {
    const record = await this.model.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!record) {
      throw new Error("No record found to increment.");
    }

    return record.toObject();
  }
}
