"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { UserView } from "@/types/tables";
import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUserIdCookie } from "./actions";
import { BioTooltip } from "./bio-tooltip";
import DeleteUserButton from "./delete-user";
import { FollowButton } from "./follow";

export default function UserSelect({
  currentUserId,
  user,
  isFollowing,
}: {
  currentUserId: string;
  user: UserView;
  isFollowing: boolean;
}) {
  const [loading, setLoading] = useState(false);

  if (!user.id) return;

  const router = useRouter();
  const switchUser = async () => {
    if (!user.id || currentUserId === user.id) return;
    setLoading(true);
    await setUserIdCookie(user.id);
    router.refresh();
    setLoading(false);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          className={cn(
            "w-0 grow flex-row items-center px-4 border-2 border-transparent",
            currentUserId === user.id
              ? "from-pumpkin_spice-500 to-pumpkin_spice-700/80 bg-gradient-to-tr"
              : "text-white from-neutral-800 to-neutral-700 bg-gradient-to-tr cursor-pointer hover:border-2 hover:border-pumpkin_spice-400",
          )}
          onClick={switchUser}
        >
          <CardContent className="w-full min-w-0 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className={cn("text-black", loading && "animate-ping")}>
                <AvatarImage src={user.media_url ?? ""} />
                <AvatarFallback>
                  {user.username?.substring(0, 2).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold">@{user.username}</p>
              <BioTooltip bio={user.bio} />
              <div className="flex gap-4 items-center w-fit justify-center">
                {currentUserId !== user.id && (
                  <FollowButton
                    currentUserId={currentUserId}
                    userId={user.id ?? ""}
                    following={isFollowing}
                  ></FollowButton>
                )}
                <p className="tabular-nums">Followers: {user.follower_count}</p>
                <p className="tabular-nums">
                  Following: {user.following_count}
                </p>
                <UsersRound />
              </div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-0 p-0 border-none bg-transparent">
        <DeleteUserButton currentUserId={currentUserId} userId={user.id} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
