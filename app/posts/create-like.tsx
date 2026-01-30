"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { likePost, unlikePost } from "./actions";

export const LikeButton = ({
  postId,
  userId,
  isLiked,
}: {
  postId: string;
  userId: string;
  isLiked: boolean;
}) => {
  const router = useRouter();

  const handleLikePost = async () => {
    const { error } = await likePost({
      post_id: postId,
      user_id: userId,
    });

    if (error) {
      console.error(`Error liking post: ${error.message}`);
    }
    router.refresh();
  };

  const handleunLikePost = async () => {
    const { error } = await unlikePost({
      post_id: postId,
      user_id: userId,
    });

    if (error) {
      console.error(`Error liking post: ${error.message}`);
    }
    router.refresh();
  };
  return isLiked ? (
    <Heart
      onClick={handleunLikePost}
      className="size-7 text-pink-400 cursor-pointer transition-colors"
      fill="currentColor"
    />
  ) : (
    <Heart
      onClick={handleLikePost}
      className="size-7 text-white hover:text-pink-400 cursor-pointer transition-colors"
      stroke="currentColor"
    />
  );
};
