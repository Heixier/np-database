import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserNotificationsWithSender } from "./fetch";
import { NotificationCard } from "./notifications-card";

export default async function Notifications({ userId }: { userId: string }) {
  const { data: notifications, error: notificationError } =
    await fetchUserNotificationsWithSender({ user_id: userId });

  return (
    <Card className="h-full bg-intense_cherry/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardContent>
            {notifications ? (
              <NotificationCard notifications={notifications} />
            ) : (
              <p>No notifications to display</p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
