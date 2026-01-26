"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostsAndCommentsListener() {
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
          console.log("new post detected");
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
          console.log("new comment detected");
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
