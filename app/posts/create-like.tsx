"use client";

import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(isLiked);

  const handleLikePost = async () => {
    setLoading(true);
    try {
      const { error } = await likePost({
        post_id: postId,
        user_id: userId,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setLiked(true);
      router.refresh();
    }
  };

  const handleunLikePost = async () => {
    setLoading(true);
    try {
      const { error } = await unlikePost({
        post_id: postId,
        user_id: userId,
      });

      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setLiked(false);
      router.refresh();
    }
  };

  return loading ? (
    <Loader2 className="animate-spin text-pink-600/80 size-7" />
  ) : liked ? (
    <Heart
      onClick={handleunLikePost}
      className="size-7 text-pink-600/80 cursor-pointer transition-colors"
      fill="currentColor"
    />
  ) : (
    <Heart
      onClick={handleLikePost}
      className="size-7 hover:text-pink-600/80 cursor-pointer transition-colors"
      stroke="currentColor"
    />
  );
};
