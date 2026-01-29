import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { fetchUser } from "../users/fetch";
import { fetchAllChatMessages } from "./fetch";

export default async function Chats({
  cookies,
}: {
  cookies: ReadonlyRequestCookies;
}) {
  const storedUserId = cookies.get("user_id")?.value ?? "";

  const { data: profile, error: userError } = await fetchUser({
    userId: storedUserId,
  });

  const { data: chats, error: chatsError } = await fetchAllChatMessages();

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Chats</CardTitle>
      </CardHeader>
      <CardContent>{JSON.stringify(chats)}</CardContent>
    </Card>
  );
}
