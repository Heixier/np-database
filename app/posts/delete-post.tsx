"use client";

import { Button } from "@/components/ui/button";
import { deletePost } from "./actions";

export const DeletePostButton = ({ postId }: { postId: string }) => {
  const deletePostHandler = async (post_id: string) => {
    const { error } = await deletePost({ post_id });

    if (error) {
      console.error(`Could not delete post: ${error.message}`);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={() => {
        deletePostHandler(postId);
      }}
    >
      Delete post
    </Button>
  );
};
