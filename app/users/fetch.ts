import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { Follow, UserView } from "@/types/tables";
import { PostgrestError } from "@supabase/supabase-js";

export const fetchAllUsers = async (): Promise<{
  data: UserView[] | null;
  error: PostgrestError | null | null;
}> => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("user_view:all");

  if (cache) return { data: JSON.parse(cache), error: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_view")
    .select()
    .order("username", { ascending: true });

  redis.set("user_view:all", JSON.stringify(data), { EX: 60 });
  return { data, error };
};

export const fetchUser = async ({ userId }: { userId: string }) => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("user_view:all");

  if (cache) {
    const data: UserView[] = JSON.parse(cache);
    const match = data.find((user) => userId === user.id);

    return { data: match, error: null };
  }

  const supabase = await createClient();

  return await supabase
    .from("user_view")
    .select()
    .eq("id", userId)
    .maybeSingle();
};

export const isFollowing = async ({
  follower_id,
  following_id,
}: {
  follower_id: string;
  following_id: string;
}): Promise<{
  data: boolean;
  error: PostgrestError | null | null;
}> => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("follows:all");

  if (cache) {
    const data: Follow[] = JSON.parse(cache);
    const match = data.find(
      (follow) =>
        follow.follower_id === follower_id &&
        follow.following_id === following_id,
    );

    return { data: !!match, error: null };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("follows").select();

  if (!error) {
    await redis.set("follows:all", JSON.stringify(data), { EX: 60 });
  }

  const match = data?.find(
    (follow) =>
      follow.follower_id === follower_id &&
      follow.following_id === following_id,
  );

  return { data: !!match, error };
};
