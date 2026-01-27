"use client";

import { Button } from "@/components/ui/button";
import { setUserIdCookie } from "./actions";
import { useRouter } from "next/navigation";

export default function SwitchUserButton({
  currentUserId,
  user_id,
}: {
  currentUserId: string;
  user_id: string;
}) {
  const router = useRouter();

  const switchUser = async () => {
    setUserIdCookie(user_id);
  };
  return (
    <Button
      disabled={currentUserId === user_id}
      variant="outline"
      onClick={() => switchUser()}
    >
      Select User
    </Button>
  );
}
