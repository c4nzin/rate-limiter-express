# Express Rate Limiter

### This set of packages provides flexible and highly customizable rate-limiting solutions for Node.js applications. The core package, @canmertinyo/rate-limiter-core, includes the in-memory implementation. To enable storage-backed rate limiting, you can integrate it with either @canmertinyo/rate-limiter-mongo for MongoDB or @canmertinyo/rate-limiter-redis for Redis.

To install (Core version only in memory):

```bash
npm install @canmertinyo/rate-limiter-core

```

To install (Mongo store)

```bash
npm install @canmertinyo/rate-limiter-mongo mongoose
```

To install (Redis store)

```bash
npm install @canmertinyo/rate-limiter-redis ioredis
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
