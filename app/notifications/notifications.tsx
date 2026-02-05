import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellRing } from "lucide-react";
import { fetchUserNotificationsWithSender } from "./fetch";
import { NotificationCard } from "./notifications-card";

export default async function Notifications({ userId }: { userId: string }) {
  const { data: notifications, error: notificationError } =
    await fetchUserNotificationsWithSender({ user_id: userId });

  return (
    <Card className="h-full backdrop-blur-sm bg-intense_cherry/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex flex-row gap-2 items-center text-2xl py-2 px-4 bg-intense_cherry-600/80 rounded-md">
          <p>Notifications</p>
          {!notifications || notifications.length === 0 ? (
            <Bell
              className="fill-white stroke-intense_cherry-800/80"
              size={32}
              strokeWidth={2}
            />
          ) : (
            <BellRing
              className="fill-white stroke-intense_cherry-800/80"
              size={32}
              strokeWidth={2}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardContent>
            {!notifications || notifications.length === 0 ? (
              <p>No notifications to display</p>
            ) : (
              <NotificationCard notifications={notifications} />
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
