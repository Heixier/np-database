import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { PostWithUserAndComments } from "@/types/extend";
import { Like } from "@/types/tables";

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
    .select("*, users!user_id(username), comments (*, users (username))")
    .order("id", { ascending: false });

  if (!error) {
    await redis.set("posts:all", JSON.stringify(data), { EX: 60 });
  }

  return { data, error };
};

export const isLiked = async ({
  post_id,
  user_id,
}: {
  post_id: string;
  user_id: string;
}) => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("likes:all");

  if (cache) {
    const data: Like[] = JSON.parse(cache);
    const match = data.find(
      (like) => like.post_id === post_id && like.user_id === user_id,
    );

    return { data: !!match, error: null };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("likes").select();

  if (!error) {
    await redis.set("likes:all", JSON.stringify(data), { EX: 60 });
  }

  const match = data?.find(
    (like) => like.post_id === post_id && like.user_id === user_id,
  );

  return { data: !!match, error };
};
