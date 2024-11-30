/**
 * @property port - Redis server port, default : 6379
 * @property host - Redis server host or IP address.
 * @property username - Redis username for authentication (optional)
 * @property password - Redis password for authentication (optional).
 * @property db - Redis database number, default is 0 (optional).
 */

export interface RedisConfig {
  port: number;

  host: string;

  username?: string;

  password?: string;

  db?: number;
}
