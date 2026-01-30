import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { UserView } from "@/types/tables";
import { BioTooltip } from "./bio-tooltip";
import { isFollowing } from "./fetch";
import { FollowButton } from "./follow";
import SwitchUserButton from "./switch-user";

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
      className={`flex-row items-center w-full border-black/10 ${currentUserId === user.id ? "bg-saffron-600/50" : "bg-white-100"} hover:bg`}
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
        <p className="font-bold text-black/60">@{user.username}</p>
        <BioTooltip bio={user.bio} />
      </CardHeader>
      <CardContent className="hidden xl:block">
        <CardDescription className="flex flex-col text-black">
          <span>Followers: {user.follower_count}</span>
          <span>Following: {user.following_count}</span>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
