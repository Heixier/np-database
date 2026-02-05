import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MailCheck, MailWarning } from "lucide-react";
import { fetchUserNotificationsWithSender } from "./fetch";
import { NotificationCard } from "./notifications-card";
import { DeleteAllNotificationsButton } from "./notifications-clear";

export default async function Notifications({ userId }: { userId: string }) {
  const { data: notifications, error: notificationError } =
    await fetchUserNotificationsWithSender({ userId: userId });

  if (notificationError) console.error(`Error: ${notificationError.message}`);

  const hasUnread = notifications?.find((notification) => !notification.read);

  return (
    <Card className="h-full backdrop-blur-sm bg-intense_cherry/50 border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex flex-row gap-2 items-center text-2xl py-2 px-4 bg-intense_cherry-600/80 rounded-md">
          <p>Notifications</p>
          {!hasUnread ? (
            <MailCheck
              className="fill-white stroke-intense_cherry-700/90"
              size={32}
              strokeWidth={2}
            />
          ) : (
            <MailWarning
              className="fill-white stroke-intense_cherry-700/90"
              size={32}
              strokeWidth={2}
            />
          )}
        </CardTitle>
        {notifications && notifications.length !== 0 && (
          <DeleteAllNotificationsButton userId={userId} />
        )}
      </CardHeader>
      <Card className="flex h-full min-h-0 bg-black/80 mx-4 min-w-0 border-none">
        <CardContent className="flex flex-col min-h-0">
          <ScrollArea className="min-h-0 h-full w-full min-w-0">
            <div className="flex">
              <div className="w-0 grow flex flex-col gap-2">
                {notifications &&
                  notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </Card>
  );
}
