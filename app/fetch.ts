import { createClient } from "@/lib/supabase/server";
import { createRedisClient } from "@/lib/redis/client";

const fetchAllProfiles = async () => {
  const redis = await createRedisClient().connect();

  const cache = await redis.get("profiles");
  if (cache) return { data: cache, error: null };

  const supabase = await createClient();

  return supabase.from("profiles").select();
};
