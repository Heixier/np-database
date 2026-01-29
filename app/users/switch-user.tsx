"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setUserIdCookie } from "./actions";

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
      className="border-none from-pumpkin_spice-600/80 via-pumpkin_spice-700/60 to-pumpkin_spice-600/80 bg-gradient-to-l [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500"
    >
      Select User
    </Button>
  );
}
