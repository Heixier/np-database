"use server";

import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const setUserIdCookie = async (user_id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("user_id", user_id);
};

export const createUser = async (data: {
  username: string;
  bio: string;
  media_url: string | null;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("user_view:all");

  const supabase = await createClient();
  return await supabase.from("users").insert(data);
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  const redis = await createRedisClient().connect();
  await redis.del("user_view:all");

  const supabase = await createClient();
  return await supabase.from("users").delete().eq("id", userId);
};

export const followUser = async (data: {
  follower_id: string;
  following_id: string;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("follows:all");
  await redis.del("user_view:all");

  const supabase = await createClient();
  return await supabase.from("follows").insert(data);
};

export const unfollowUser = async ({
  follower_id,
  following_id,
}: {
  follower_id: string;
  following_id: string;
}) => {
  const redis = await createRedisClient().connect();
  await redis.del("follows:all");
  await redis.del("user_view:all");

  const supabase = await createClient();
  return await supabase
    .from("follows")
    .delete()
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);
};
