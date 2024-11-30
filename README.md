# Express Rate Limiter

### This middleware helps to restrict the number of requests a client can make within a given time period. It's ideal for lightweight use cases and can be easily extended with in-memory, Redis, or MongoDB as storage options.

To install :

```typescript
npm i @canmertinyo/rate-limit-express
```

# Example usage :

```typescript
import express from "express";
import { rateLimiter } from "@canmertinyo/rate-limit-express";

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
import { rateLimiter, RedisStorage } from "@canmertinyo/rate-limit-express";

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
import { MongoStorage, rateLimiter } from "@canmertinyo/rate-limit-express";

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
