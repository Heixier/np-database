import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareMore } from "lucide-react";
import ClearChatButton from "./chat-clear";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { fetchAllChatMessages } from "./fetch";

export default async function Chats({ userId }: { userId: string }) {
  const { data: chats, error: chatsError } = await fetchAllChatMessages();

  if (chatsError) return <div>Error: {chatsError.message}</div>;
  if (!chats) return <div>No chats to load</div>;

  return (
    <Card className="flex flex-col h-full w-full backdrop-blur-sm overflow-y-hidden bg-electric_indigo/50 min-w-0 border-none">
      <CardHeader className="flex flex-row items-center justify-between w-full min-w-0">
        <CardTitle className="flex flex-row gap-2 items-center text-2xl rounded-md bg-electric_indigo-600/80 py-2 px-4">
          <p>Chats</p>
          <MessageSquareMore
            className="fill-white stroke-electric_indigo"
            size={32}
            strokeWidth={2}
          />
        </CardTitle>
        {chats && chats.length !== 0 && <ClearChatButton />}
      </CardHeader>
      <Card className="flex h-full min-h-0 bg-black/80 mx-4 min-w-0 border-none">
        <CardContent className="flex flex-col min-h-0">
          <ScrollArea className="min-h-0 h-full w-full min-w-0">
            <div className="flex">
              <div className="w-0 grow">
                {chats.map((chat) => (
                  <ChatMessage key={chat.id} currentUser={userId} chat={chat} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="px-4 border-round">
        <ChatInput userId={userId}></ChatInput>
      </div>
    </Card>
  );
}
