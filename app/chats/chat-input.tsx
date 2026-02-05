"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerDownRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";
import { sendChatMessage } from "./actions";

export const ChatInput = ({ userId }: { userId: string }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!message) return;
    if (event.key === "Enter" && !event.shiftKey) handleSendMessage();
  };

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const { error } = await sendChatMessage({ userId, message });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setMessage("");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-1 flex-row border-4 border-electric_indigo-400 bg-white rounded-lg">
      <Input
        placeholder="Type here to chat"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-none focus-visible:ring-0 focus-visible:border-none"
        onKeyDown={handleInputKeyPress}
      ></Input>
      <Button
        onClick={handleSendMessage}
        variant="ghost"
        className="font-bold border-l rounded-none focus:border-none focus-visible:border-none bg-neutral-800 text-white"
        disabled={!message}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex flex-row items-center gap-2">
            <p>Send</p>
            <CornerDownRight />
          </div>
        )}
      </Button>
    </div>
  );
};
