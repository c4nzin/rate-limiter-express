# Express Rate Limiter
### A simple in-memory rate-limiting middleware for Express.js to restrict the number of requests a client can make within a given time. Ideal for lightweight use cases


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
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

```
