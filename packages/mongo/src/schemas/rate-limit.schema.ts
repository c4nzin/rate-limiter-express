import mongoose, { Schema } from "mongoose";
import { RateLimitRecord } from "@canmertinyo/rate-limiter-core";

export const RATE_LIMIT_SCHEMA_CONST = "RateLimit";

export const RateLimitSchema = new Schema<RateLimitRecord>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  },
  { versionKey: false }
);

export const RateLimitModel = mongoose.model<RateLimitRecord>(
  RATE_LIMIT_SCHEMA_CONST,
  RateLimitSchema
);
