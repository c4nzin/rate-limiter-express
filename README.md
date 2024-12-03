# Express Rate Limiter

### This set of packages provides flexible and highly customizable rate-limiting solutions for Node.js applications. The core package, @canmertinyo/rate-limiter-core, includes the in-memory implementation. To enable storage-backed rate limiting, you can integrate it with either @canmertinyo/rate-limiter-mongo for MongoDB, @canmertinyo/rate-limiter-redis for Redis, or @canmertinyo/rate-limiter-memcached for Memcached.

## Rate Limiter Options

| **Option**         | **Type**   | **Description**                                                                           | **Default Value**        | **Example**                                             |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------- |
| `ms`               | `number`   | Time window in milliseconds for rate limiting.                                            | `60000` (1 minute)       | `ms: 60000`                                             |
| `maxRequest`       | `number`   | Maximum requests allowed within the time window.                                          | `10`                     | `maxRequest: 10`                                        |
| `storage`          | `object`   | Storage manager for rate limits (e.g., in-memory, MongoDB, Redis, Memcached).             | `undefined` (in-memory)  | `storage: mongoStorage`                                 |
| `message`          | `string`   | Custom message returned when rate limit is exceeded.                                      | `"Too many requests"`    | `message: "Too many requests, please try again later."` |
| `statusCode`       | `number`   | HTTP status code for rate limit responses.                                                | `429`                    | `statusCode: 429`                                       |
| `keyGenerator`     | `function` | Function to generate a unique key for rate limiting (e.g., based on `req.ip` or headers). | `(req) => req.ip`        | `keyGenerator: (req) => req.ip`                         |
| `skip`             | `function` | Function to bypass rate limiting for certain requests (e.g., based on user role).         | `undefined`              | `skip: (req) => req.headers["x-user-role"] === "admin"` |
| `errorHandler`     | `function` | Error handling function for issues from the storage layer.                                | Logs error and proceeds. | `errorHandler: (req, res, next) => next()`              |
| `passOnStoreError` | `boolean`  | Whether to allow requests to pass even if the storage fails.                              | `false`                  | `passOnStoreError: true`                                |

To install (Core version only in memory):

```bash
npm install @canmertinyo/rate-limiter-core
```

To install (Mongo store):

```bash
npm install @canmertinyo/rate-limiter-mongo mongoose
```

To install (Redis store)

```bash
npm install @canmertinyo/rate-limiter-redis ioredis
```

To install (Memcached store)

```bash
npm install @canmertinyo/rate-limiter-memcached memcached
```

# Example usage :

```typescript
import express from "express";
import { rateLimiter } from "@canmertinyo/rate-limiter-core";

const app = express();

// Apply rate limiter middleware
app.use(
  rateLimiter({
    ms: 60000, // Time in milliseconds
    maxRequest: 5, // Maximum requests allowed within the time
    //DEFAULT IS IN MEMORY
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

# Using Redis As A Store Manager

```typescript
import express from "express";
import { RedisStorage, RateLimiter } from "@canmertinyo/rate-limiter-redis";

const app = express();
const port = 3001;

// Configure the rate limiter with Redis storage
app.use(
  rateLimiter({
    ms: 5000, // Time window in milliseconds
    maxRequest: 2, // Maximum requests allowed in the time window
    storage: new RedisStorage({ host: "127.0.0.1", port: 6379 }), // Redis configuration
  })
);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

# Using Mongo As A Store Manager

```typescript
import express from "express";
import { MongoStorage, rateLimiter } from "@canmertinyo/rate-limiter-mongo";

const app = express();
const port = 3001;

// MongoDB connection string (replace with your MongoDB URL)
const mongoUrl = "mongodb://your-mongodb-url";

app.use(
  rateLimiter({
    ms: 5000, // Time window in milliseconds
    maxRequest: 2, // Maximum requests allowed in the time window
    storage: new MongoStorage(mongoUrl), // MongoDB configuration
  })
);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

```typescript
app.use(
  rateLimiter({
    ms: 60000, // Time window in milliseconds
    maxRequest: 10, // Maximum requests allowed
    storage: mongoStorage, // Use MongoDB or Redis as storage or just leave it as empty. it will behave in memory storage
    message: "Too many requests, please try again later.", // Custom rate limit message
    statusCode: 429, // OPTIONAL: You can fully optimize HTTP status code for rate limit response
    keyGenerator: (req) => req.ip, //OPTIONAL :  Custom key generator
    skip: (req) => {
      //OPTIONAL :
      const userRole = req.headers["x-user-role"]; // Assume user role is passed in headers
      return userRole === "admin"; // Skip rate limiting for admin users
    },
    errorHandler: (req, res, next) => {
      console.error("Rate limiter error");
      next();
    }, // Handle errors from storage
    passOnStoreError: true, // Pass requests even if storage fails
  })
);
```

# Using memcached as a store manager
```typescript
import express from "express";
import { MemcachedStore, rateLimiter } from "@canmertinyo/rate-limiter-memcached";

const app = express();
const port = 3001;

// Configure the rate limiter with Memcached storage
app.use(
  rateLimiter({
    ms: 5000, // Time window in milliseconds
    maxRequest: 2, // Maximum requests allowed in the time window
    storage: new MemcachedStore("127.0.0.1:11211", { //optons for customize db behaivor }), // Memcached configuration
  })
);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

```
