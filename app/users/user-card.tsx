import { UserView } from "@/types/tables";
import SwitchUserButton from "./switch-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isFollowing } from "./fetch";
import { FollowButton } from "./follow";
import { BioTooltip } from "./bio-tooltip";

export const UserCard = async ({
  currentUserId,
  user,
}: {
  currentUserId: string;
  user: UserView;
}) => {
  const { data: following } = await isFollowing({
    follower_id: currentUserId,
    following_id: user.id ?? "",
  });

  return (
    <Card
      className={`flex-row items-center w-full ${currentUserId === user.id ? "bg-green-400/10" : "bg-white-100"} hover:bg`}
    >
      <CardHeader className="flex flex-1 flex-row px-4 gap-4 min-w-0 items-center justify-start">
        {currentUserId !== user.id && (
          <SwitchUserButton
            currentUserId={currentUserId}
            user_id={user.id ?? ""}
          />
        )}
        {currentUserId !== user.id && (
          <FollowButton
            currentUserId={currentUserId}
            userId={user.id ?? ""}
            following={following}
          ></FollowButton>
        )}
        <Avatar>
          <AvatarFallback className="text-xs">
            {user.username?.substring(0, 2).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <span>{user.username}</span>
        <BioTooltip bio={user.bio} />
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col">
          <span>Followers: {user.follower_count}</span>
          <span>Following: {user.following_count}</span>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
