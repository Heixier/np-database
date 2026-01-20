import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";

export const fetchAllPosts = async () => {
  const redis = await createRedisClient().connect();

  const cache = await redis.get("posts:all");

  if (cache) return { data: JSON.parse(cache), error: null };
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, users!user_id(username), comments(*, users!user_id(username) )")
    .order("created_at", { ascending: false });

  await redis.set("posts:all", JSON.stringify(data), { EX: 60 }); // expires in 5 minutes

  return { data, error };
};
