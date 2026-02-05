"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationWithSender } from "@/types/tables";
import {
  Heart,
  Loader2,
  Mail,
  MailOpen,
  StickyNote,
  UserPlus2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteNotification, setNotificationReadStatus } from "./actions";

export const NotificationCard = ({
  notification,
}: {
  notification: NotificationWithSender | null;
}) => {
  if (!notification) return;

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleNotificationReadStatus = async (
    notification: NotificationWithSender,
  ) => {
    if (!notification.id) return;
    setLoading(true);

    try {
      const { error } = await setNotificationReadStatus({
        userId: notification.user_id,
        notificationId: notification.id,
        read: !notification.read,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleDeleteNotification = async (
    userId: string | null,
    notificationId: string | null,
  ) => {
    if (!userId || !notificationId) return;
    setLoading(true);

    try {
      const { error } = await deleteNotification({ userId, notificationId });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Card
      className="flex relative from-neutral-800 to-neutral-900 bg-gradient-to-tr w-full border-none hover:from-intense_cherry-300 hover:to-intense_cherry-400 text-white font-bold"
      onClick={() => handleNotificationReadStatus(notification)}
    >
      <CardContent className="flex flex-row items-center">
        <div className="w-full flex flex-row items-center gap-6 justify-between">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : notification.read ? (
            <Mail className="stroke-neutral-500/90" />
          ) : (
            <MailOpen className="stroke-intense_cherry-700/90" />
          )}
          {notification.type === "like" && (
            <Heart className="stroke-none fill-intense_cherry-600" />
          )}
          {notification.type === "follow" && (
            <UserPlus2 className="stroke-pumpkin_spice-600/90" />
          )}
          {notification.type === "post" && (
            <StickyNote className="stroke-saffron-600/90" />
          )}
          <Avatar>
            <AvatarImage src={notification.sender_media_url ?? ""} />
            <AvatarFallback>
              {notification.sender_name?.substring(0, 2).toUpperCase() ?? "AN"}
            </AvatarFallback>
          </Avatar>
          <p className="flex flex-1 w-full">{notification.content}</p>
        </div>
        <Button
          variant="ghost"
          className="group absolute top-1 right-1 hover:bg-opacity-0 rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNotification(notification.user_id, notification.id);
          }}
        >
          <X className="size-6 stroke-intense_cherry-600 group-hover:stroke-white transition-colors" />
        </Button>
      </CardContent>
    </Card>
  );
};
