import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { fetchUser } from "../users/fetch";
import { fetchUserNotificationsWithSender } from "./fetch";

export default async function Notifications({
  cookies,
}: {
  cookies: ReadonlyRequestCookies;
}) {
  const storedUserId = cookies.get("user_id")?.value ?? "";

  const { data: profile, error: userError } = await fetchUser({
    userId: storedUserId,
  });
  const { data: notifications, error: notificationError } =
    await fetchUserNotificationsWithSender({ user_id: profile?.id });

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{JSON.stringify(notifications)}</p>
      </CardContent>
    </Card>
  );
}
