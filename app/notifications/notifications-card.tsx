import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationWithSender } from "@/types/tables";

export const NotificationCard = ({
  notifications,
}: {
  notifications: NotificationWithSender[];
}) => {
  return (
    <div>
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardContent>
            <div className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {notification.sender_name?.substring(0, 2).toUpperCase() ??
                    "AN"}
                </AvatarFallback>
              </Avatar>
              <p>{notification.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
