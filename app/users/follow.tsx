"use client";

import { Button } from "@/components/ui/button";
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
  const followHandler = async () => {
    const { error } = await followUser({
      follower_id: currentUserId,
      following_id: userId,
    });

    if (error) {
      console.error(`Failed to follow user: ${error.message}`);
    }
  };

  const unfollowHandler = async () => {
    const { error } = await unfollowUser({
      follower_id: currentUserId,
      following_id: userId,
    });

    if (error) {
      console.error(`Failed to unfollow user: ${error.message}`);
    }
  };

  return (
    <div className="min-w-24 max-w-24">
      {following ? (
        <Button
          variant="destructive"
          onClick={unfollowHandler}
          className="w-full"
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={followHandler}
          className="bg-green-400/80 w-full"
        >
          Follow
        </Button>
      )}
    </div>
  );
};
