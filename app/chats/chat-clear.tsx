"use client";

import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAllChats } from "./actions";

export default function ClearChatButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleClearChat = async () => {
    setLoading(true);

    try {
      const { error } = await deleteAllChats();
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  return loading ? (
    <Loader2 className="animate-spin" />
  ) : (
    <Button
      onClick={handleClearChat}
      className="group opacity-80 hover:opacity-100"
    >
      <p className="font-bold text-neutral-400/80 group-hover:text-red-600">
        Clear Chat
      </p>
      <MessageSquareOff className="stroke-neutral-400/80 group-hover:stroke-red-600" />
    </Button>
  );
}
