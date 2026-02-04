"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { ChatWithUser } from "@/types/extend";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteChatMessage } from "./actions";

export const ChatMessage = ({
  currentUser,
  chat,
}: {
  currentUser: string;
  chat: ChatWithUser;
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDeleteMessage = async () => {
    setLoading(true);
    try {
      const { error } = await deleteChatMessage({ chatId: chat.id });
      if (error) throw new Error(error.message);
      router.refresh();
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          key={chat.id}
          className={cn(
            "text-white text-sm items-center flex flex-row mb-4 border-none rounded-lg max-w-[60%] p-2 w-fit gap-2",
            currentUser === chat.user_id
              ? "ml-auto from-electric_indigo-500 to-electric_indigo-600 bg-gradient-to-br pl-2"
              : "mr-auto from-neutral-700/80 to-neutral-800/60 bg-gradient-to-tr pr-4",
          )}
        >
          <Avatar>
            <AvatarImage src={chat.users?.media_url ?? ""}></AvatarImage>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-bold">@{chat.users?.username ?? ""}</div>
            <div className="break-words">{chat.content}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="flex min-w-0 bg-transparent border-none overflow-hidden">
        {loading ? (
          <Loader2 className="animate-spin text-neutral-200 bg-transparent" />
        ) : (
          <Button
            onClick={handleDeleteMessage}
            variant="destructive"
            disabled={currentUser !== chat.user_id}
          >
            <Trash2 className="w-fit" />
            Delete
          </Button>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
