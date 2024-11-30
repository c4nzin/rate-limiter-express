import { RateLimiter } from "./rate-limiter.interface";

/**
 * Options for the rate limiter configuration.
 *
 * @property ms - The time window in milliseconds for rate limiting.
 * @property maxRequest - The maximum number of allowed requests.
 * @property storage?(optional) - The storage property allows you to use a specific storage manager. [REDIS,MONGO, DEFAULT=INMEMORY]
 */
export interface RateLimiterOptions {
  ms: number;
  maxRequest: number;
  storage?: RateLimiter;
}
