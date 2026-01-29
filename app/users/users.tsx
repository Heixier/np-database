import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { CreateUser } from "./create-user";
import { fetchAllUsers } from "./fetch";
import UsersAndFollowsListener from "./listener";
import { UserCard } from "./user-card";

export default async function Users({
  cookies,
}: {
  cookies: ReadonlyRequestCookies;
}) {
  const { data, error } = await fetchAllUsers();
  const currentUserId = cookies.get("user_id");

  if (error) return <div>Database Error: {error.message}</div>;
  if (!data) return <div>No Users Found</div>;

  return (
    <Card className="border-pumpkin_spice/80 backdrop-blur-md bg-black/5 h-full min-w-0 px-4 overflow-y-auto">
      <UsersAndFollowsListener />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Users</CardTitle>
        <CreateUser />
      </CardHeader>
      <Card className="bg-pumpkin_spice-800/20 border-pumpkin_spice/80 min-w-0 px-4 overflow-y-auto">
        {data.map((user) => (
          <div key={user.id}>
            <div className="flex flex-row gap-4">
              <UserCard
                currentUserId={currentUserId?.value ?? ""}
                user={user}
              ></UserCard>
            </div>
          </div>
        ))}
      </Card>
    </Card>
  );
}
