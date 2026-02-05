"use server";

import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";

export const setNotificationReadStatus = async ({
  userId,
  notificationId,
  read,
}: {
  userId: string | null;
  notificationId: string | null | undefined;
  read: boolean;
}) => {
  if (!notificationId)
    return { data: null, error: { message: "No notification ID provided" } };
  if (!userId) return { data: null, error: { message: "No user ID provided" } };

  // Invalidate cache
  const redis = await createRedisClient().connect();
  await redis.del(`notifications:${userId}`);

  const supabase = await createClient();

  return await supabase
    .from("notifications")
    .update({ read: read })
    .eq("id", notificationId);
};

export const deleteNotification = async ({
  userId,
  notificationId,
}: {
  userId: string | null;
  notificationId: string | null;
}) => {
  if (!notificationId)
    return { data: null, error: { message: "No notification ID provided" } };
  if (!userId) return { data: null, error: { message: "No user ID provided" } };

  // At this point I've realised that it's too late for me to properly document the code
  const redis = await createRedisClient().connect();
  await redis.del(`notifications:${userId}`);

  const supabase = await createClient();

  return await supabase.from("notifications").delete().eq("id", notificationId);
};

export const deleteAllUserNotifications = async ({
  userId,
}: {
  userId: string | null;
}) => {
  if (!userId) return { data: null, error: { message: "No user ID provided" } };

  const redis = await createRedisClient().connect();
  await redis.del(`notifications:${userId}`);

  const supabase = await createClient();

  return await supabase.from("notifications").delete().eq("user_id", userId);
};
