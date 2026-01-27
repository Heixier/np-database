import { fetchAllUsers } from "./fetch";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCard } from "./user-card";
import UsersAndFollowsListener from "./listener";
import { CreateUser } from "./create-user";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
    <Card className="h-full min-w-0 px-8 overflow-y-auto">
      <UsersAndFollowsListener />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Users</CardTitle>
        <CreateUser />
      </CardHeader>
      <Card className="min-w-0 px-4 overflow-y-auto">
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
