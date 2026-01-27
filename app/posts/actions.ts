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

export const deletePost = async ({ post_id }: { post_id: string }) => {
  const redis = await createRedisClient().connect();
  await redis.del("posts:all");

  const supabase = await createClient();
  return await supabase.from("posts").delete().eq("id", post_id);
};

export const createComment = async (data: {
  post_id: string;
  user_id: string;
  content: string;
  replying_to: string | null;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("posts:all"); //posts:all contains both the posts and comment data

  const supabase = await createClient();
  return await supabase.from("comments").insert(data);
};

export const deleteComment = async ({ comment_id }: { comment_id: string }) => {
  const redis = await createRedisClient().connect();
  await redis.del("posts:all");

  const supabase = await createClient();
  return await supabase.from("comments").delete().eq("id", comment_id);
};

export const likePost = async (data: { post_id: string; user_id: string }) => {
  const redis = await createRedisClient().connect();
  await redis.del("likes:all");
  await redis.del("posts:all");

  const supabase = await createClient();
  return await supabase.from("likes").insert(data);
};

export const unlikePost = async ({
  post_id,
  user_id,
}: {
  post_id: string;
  user_id: string;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("likes:all");
  await redis.del("posts:all");

  const supabase = await createClient();
  return await supabase
    .from("likes")
    .delete()
    .eq("post_id", post_id)
    .eq("user_id", user_id);
};
