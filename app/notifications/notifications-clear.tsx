"use client";

import { Button } from "@/components/ui/button";
import { Loader2, MailX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAllUserNotifications } from "./actions";

// Starting to realise I should have been writing documentation
// Also starting to realise my coding style depends on my mood
export const DeleteAllNotificationsButton = ({
  userId,
}: {
  userId: string | null;
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleDeleteAllNotifications = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { error } = await deleteAllUserNotifications({ userId });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  return loading ? (
    <Loader2 className="animate-spin" />
  ) : (
    <Button
      className="group opacity-80 hover:opacity-100"
      onClick={handleDeleteAllNotifications}
    >
      <p className="font-bold text-neutral-400/80 group-hover:text-red-600">
        Clear Notifications
      </p>
      <MailX className="stroke-neutral-400/80 group-hover:stroke-red-600" />
    </Button>
  );
};
