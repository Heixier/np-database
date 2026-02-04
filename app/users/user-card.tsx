import { UserView } from "@/types/tables";
import { isFollowing } from "./fetch";
import UserSelect from "./user-select";

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
    <UserSelect
      currentUserId={currentUserId}
      user={user}
      isFollowing={following}
    />
  );
};
