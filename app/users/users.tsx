import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUser } from "./create-user";
import { fetchAllUsers } from "./fetch";
import UsersAndFollowsListener from "./listener";
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
    <Card className="border-pumpkin_spice/80 backdrop-blur-md bg-pumpkin_spice/50 px-4">
      <UsersAndFollowsListener />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Users</CardTitle>
        <CreateUser />
      </CardHeader>
      <Card className="bg-pumpkin_spice-800/20 border-black/20 px-4 overflow-y-auto">
        {data.map((user) => (
          <div key={user.id}>
            <div className="flex flex-row gap-4">
              <UserCard currentUserId={userId ?? ""} user={user}></UserCard>
            </div>
          </div>
        ))}
      </Card>
    </Card>
  );
}
