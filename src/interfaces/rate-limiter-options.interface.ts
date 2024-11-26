/**
 * Options for the rate limiter configuration.
 *
 * @property ms - The time window in milliseconds for rate limiting.
 * @property maxRequest - The maximum number of allowed requests in the time window.
 */
export interface RateLimiterOptions {
  /** The time in milliseconds for rate limiting. */
  ms: number;
  /** The maximum number of allowed requests in the time window. */
  maxRequest: number;
}
