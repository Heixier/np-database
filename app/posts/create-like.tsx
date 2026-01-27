"use client";

import { likePost, unlikePost } from "./actions";
import { Heart } from "lucide-react";

export const LikeButton = ({
  postId,
  userId,
  isLiked,
}: {
  postId: string;
  userId: string;
  isLiked: boolean;
}) => {
  const handleLikePost = async () => {
    const { error } = await likePost({
      post_id: postId,
      user_id: userId,
    });

    if (error) {
      console.error(`Error liking post: ${error.message}`);
    }
  };

  const handleunLikePost = async () => {
    const { error } = await unlikePost({
      post_id: postId,
      user_id: userId,
    });

    if (error) {
      console.error(`Error liking post: ${error.message}`);
    }
  };
  return isLiked ? (
    <Heart
      onClick={handleunLikePost}
      className="text-pink-400 cursor-pointer transition-colors"
      fill="currentColor"
    />
  ) : (
    <Heart
      onClick={handleLikePost}
      className="text-gray-300 hover:text-pink-400 cursor-pointer transition-colors"
      stroke="currentColor"
    />
  );
};
