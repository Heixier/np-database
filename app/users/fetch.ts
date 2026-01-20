import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";

export const fetchAllUsers = async () => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("users:all");

  if (cache) return { data: JSON.parse(cache), error: null };

  const supabase = await createClient();
  return await supabase.from("users").select("*, follows!following_id(count)");
};
