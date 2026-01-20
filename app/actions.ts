"use server";

import { createRedisClient } from "@/lib/redis/client";

export const redisTest = async () => {
  const redisClient = createRedisClient();

  const redis = await redisClient.connect();

  await redis.set("temp:tea", "chrysanthemum");

  return await redis.get("temp:tea");
};
