/**
 * Options for the rate limiter configuration.
 *
 * @property ms - The time window in milliseconds for rate limiting.
 * @property maxRequest - The maximum number of allowed requests
 */
export interface RateLimiterOptions {
  ms: number;
  maxRequest: number;
}
