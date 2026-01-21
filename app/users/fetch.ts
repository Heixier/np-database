import { createRedisClient } from "@/lib/redis/client";
import { createClient } from "@/lib/supabase/server";
import { UserView } from "@/types/tables";
import { PostgrestError } from "@supabase/supabase-js";

export const fetchAllUsers = async (): Promise<{
  data: UserView[] | null;
  error: PostgrestError | null | null;
}> => {
  const redis = await createRedisClient().connect();
  const cache = await redis.get("users:all");

  if (cache) return { data: JSON.parse(cache), error: null };

  const supabase = await createClient();
  return await supabase.from("user_view").select();
};
