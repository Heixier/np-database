import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRound } from "lucide-react";
import { CreateUser } from "./create-user";
import { fetchAllUsers } from "./fetch";
import { UserCard } from "./user-card";

export default async function Users({
  userId,
}: {
  userId: string | null | undefined;
}) {
  const { data, error } = await fetchAllUsers();

  if (error) return <div>Database Error: {error.message}</div>;
  if (!data) return <div>No Users Found</div>;

  return (
    <Card className="border-none backdrop-blur-md bg-pumpkin_spice/50 px-4">
      {/* <UsersAndFollowsListener /> */}
      <CardHeader className="flex flex-row items-center justify-between px-2">
        <CardTitle className="flex flex-row gap-2 items-center text-2xl">
          <p>Users</p>
          <UserRound
            className="fill-white stroke-pumpkin_spice-400"
            size={32}
            strokeWidth={2}
          />
        </CardTitle>
        <CreateUser />
      </CardHeader>
      <Card className="flex flex-col h-full min-h-0 bg-black/80 border-none p-0">
        <ScrollArea className="min-h-0 pt-6 px-4">
          <div className="flex flex-col gap-2">
            {data.map((user) => (
              <div key={user.id} className="flex flex-row">
                <UserCard currentUserId={userId ?? ""} user={user}></UserCard>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </Card>
  );
}
