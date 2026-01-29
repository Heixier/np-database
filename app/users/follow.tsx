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
          className="w-full border-none"
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={followHandler}
          className="w-full  border-none from-green-400/80 via-green-300/80 to-green-400/80 bg-gradient-to-r l hover:bg-transparent [background-size:300%_auto] hover:bg-[99%_center] transition-all duration-500"
        >
          Follow
        </Button>
      )}
    </div>
  );
};
