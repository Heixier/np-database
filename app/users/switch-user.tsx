"use client";

import { Button } from "@/components/ui/button";
import { setUserIdCookie } from "./actions";

export default function SwitchUserButton({
  currentUserId,
  user_id,
}: {
  currentUserId: string;
  user_id: string;
}) {
  const switchUser = async () => {
    setUserIdCookie(user_id);
  };
  return (
    <Button
      disabled={currentUserId === user_id}
      variant="outline"
      onClick={() => switchUser()}
      className="border-none from-saffron-500/80 via-saffron-800/60 to-saffron-500/80 bg-gradient-to-l [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500"
    >
      Select User
    </Button>
  );
}
