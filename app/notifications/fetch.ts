import { createClient } from "@/lib/supabase/server";

// Not using cache here due to how often the data changes
export const fetchUserNotificationsWithSender = async ({
  user_id,
}: {
  user_id: string | null | undefined;
}) => {
  if (!user_id)
    return { data: null, error: { message: "No user ID provided" } };
  const supabase = await createClient();

  return await supabase
    .from("notifications_with_sender_name")
    .select()
    .eq("user_id", user_id);
};
