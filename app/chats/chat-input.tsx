"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendChatMessage } from "./actions";

export const ChatInput = ({ userId }: { userId: string }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const { error } = await sendChatMessage({ userId, message });
      if (error) throw new Error(error.message);
      router.refresh();
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };
  return (
    <div className="flex flex-1 flex-row border rounded-lg">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-none"
      ></Input>
      <Button
        onClick={handleSendMessage}
        variant="ghost"
        className="border-l rounded-none"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Send"}
      </Button>
    </div>
  );
};
