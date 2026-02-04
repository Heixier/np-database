"use client";

import { Button } from "@/components/ui/button";
import { Loader2, UserRoundPlus, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { followUser, unfollowUser } from "./actions";

export const FollowButton = ({
  currentUserId,
  userId,
  following,
}: {
  currentUserId: string;
  userId: string;
  following: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [followState, setFollowState] = useState(following);

  const router = useRouter();
  const followHandler = async () => {
    setLoading(true);
    try {
      const { error } = await followUser({
        follower_id: currentUserId,
        following_id: userId,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setFollowState(true);
      router.refresh();
    }
  };

  const unfollowHandler = async () => {
    setLoading(true);
    try {
      const { error } = await unfollowUser({
        follower_id: currentUserId,
        following_id: userId,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setFollowState(false);
      router.refresh();
    }
  };

  return loading ? (
    <Loader2 className="animate-spin w-fit size-9" />
  ) : (
    <div className="w-fit">
      {followState ? (
        <Button
          variant="destructive"
          onClick={unfollowHandler}
          className="w-full border-none"
        >
          <UserRoundX />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={followHandler}
          className="w-full border-none from-green-400/80 via-green-300/80 to-green-400/80 bg-gradient-to-r hover:bg-transparent [background-size:300%_auto] hover:bg-[99%_center] transition-all duration-500"
        >
          <UserRoundPlus />
        </Button>
      )}
    </div>
  );
};
