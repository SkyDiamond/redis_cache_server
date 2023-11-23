const express = require("express");
const redis = require("redis");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
dotenv.config();

const port = 5555;

let redisClient = null;

const initRedis = async () => {
  redisClient = redis.createClient({
    host: "redis-server",
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  });
  redisClient.on("error", (err) => console.log("Redis error:", err));
  await redisClient.connect();
};

app.get("/api", async (req, res) => {
  const cacheData = await redisClient.get("data");
  if (cacheData) {
    console.log(`sending cached data: ${cacheData}`);
    return res.json(cacheData);
  }

  const data = "Hello from Redis";
  console.log(`sending new data: ${data}`);
  await redisClient.set("data", data);

  res.json(data);
});

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await initRedis();
});
