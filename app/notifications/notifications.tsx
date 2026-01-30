import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserNotificationsWithSender } from "./fetch";

export default async function Notifications({ userId }: { userId: string }) {
  const { data: notifications, error: notificationError } =
    await fetchUserNotificationsWithSender({ user_id: userId });

  return (
    <Card className="h-full overflow-y-auto bg-intense_cherry/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{JSON.stringify(notifications)}</p>
      </CardContent>
    </Card>
  );
}
