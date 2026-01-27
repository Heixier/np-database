"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsersAndFollowsListener() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("users_and_follows")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
          table: "users",
        },
        () => {
          router.refresh();
        },
      )
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
          table: "follows",
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);
  return null;
}
