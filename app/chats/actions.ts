"use server";

import { createClient } from "@/lib/supabase/server";

export const sendChatMessage = async ({
  userId,
  message,
}: {
  userId: string | null | undefined;
  message: string;
}) => {
  if (!userId) return { data: null, error: { message: "No user ID provided" } };
  const supabase = await createClient();

  return await supabase
    .from("chats")
    .insert({ user_id: userId, content: message });
};

export const deleteChatMessage = async ({ chatId }: { chatId: string }) => {
  const supabase = await createClient();

  return await supabase.from("chats").delete().eq("id", chatId);
};

export const deleteAllChats = async () => {
  const supabase = await createClient();

  return await supabase.from("chats").delete();
};
