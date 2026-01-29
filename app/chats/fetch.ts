import { createClient } from "@/lib/supabase/server";

export const fetchAllChatMessages = async () => {
  const supabase = await createClient();

  return await supabase.from("chats").select(`*, users !user_id(username)`);
};
