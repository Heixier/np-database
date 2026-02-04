"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost } from "./actions";

export const DeletePostButton = ({ postId }: { postId: string }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const deletePostHandler = async (post_id: string) => {
    setLoading(true);
    try {
      const { error } = await deletePost({ post_id });
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
      variant="destructive"
      onClick={() => {
        deletePostHandler(postId);
      }}
      className="min-w-0 flex w-fit h-fit p-2"
    >
      <X />
    </Button>
  );
};
