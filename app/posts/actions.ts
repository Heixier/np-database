"use server";

import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";

export const createPost = async (data: {
  user_id: string;
  title: string;
  content: string;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("posts:all");

  const supabase = await createClient();
  return await supabase.from("posts").insert(data);
};
