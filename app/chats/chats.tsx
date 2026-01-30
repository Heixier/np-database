import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllChatMessages } from "./fetch";

export default async function Chats({ userId }: { userId: string }) {
  const { data: chats, error: chatsError } = await fetchAllChatMessages();

  return (
    <Card className="h-full overflow-y-auto bg-electric_indigo/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Chats</CardTitle>
      </CardHeader>
      <CardContent>{JSON.stringify(chats)}</CardContent>
    </Card>
  );
}
