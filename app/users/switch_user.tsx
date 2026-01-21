"use client";

import { Button } from "@/components/ui/button";
import { setUserIdCookie } from "./actions";
import { useRouter } from "next/navigation";

export default function SwitchUserButton(props: { user_id: string }) {
  const router = useRouter();

  const switchUser = async () => {
    setUserIdCookie(props.user_id);
    router.refresh();
  };
  return <Button onClick={() => switchUser()}>Change User</Button>;
}
