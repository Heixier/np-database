"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
    <Button variant="destructive" onClick={handleClearChat}>
      Clear Chat
    </Button>
  );
}
