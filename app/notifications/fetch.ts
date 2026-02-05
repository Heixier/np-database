import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { NotificationWithSender } from "@/types/tables";

export const fetchUserNotificationsWithSender = async ({
  userId,
}: {
  userId: string | null | undefined;
}) => {
  if (!userId) return { data: null, error: { message: "No user ID provided" } };
  const redis = await createRedisClient().connect();

  const cache = await redis.get(`notifications:${userId}`);

  if (cache)
    return {
      data: JSON.parse(cache) as NotificationWithSender[],
      error: null,
    };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications_with_sender_details")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!error) {
    await redis.set(`notifications:${userId}`, JSON.stringify(data), {
      EX: 10, // Extremely short because it's too expensive to find all followers and reset only their notifications every time a user makes a post. Should have made a fetchallfollowers but too late
    });
  }

  return { data, error };
};
