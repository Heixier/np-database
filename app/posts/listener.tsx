"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostsAndCommentsAndLikesListener() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("posts_and_comments")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
          table: "posts",
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
          table: "comments",
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
