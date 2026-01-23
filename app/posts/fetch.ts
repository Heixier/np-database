import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { PostWithUserAndComments } from "@/types/extend";

export const fetchAllPosts = async () => {
  const redis = await createRedisClient().connect();

  const cache = await redis.get("posts:all");

  if (cache)
    return {
      data: JSON.parse(cache) as PostWithUserAndComments[],
      error: null,
    };
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, comments (*, users (username))");

  await redis.set("posts:all", JSON.stringify(data), { EX: 60 });

  return { data, error };
};
