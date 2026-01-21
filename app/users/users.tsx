import { cookies } from "next/headers";
import { fetchAllUsers } from "./fetch";
import SwitchUserButton from "./switch_user";

export default async function Users() {
  const { data, error } = await fetchAllUsers();
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_id");

  if (error) return <div>Database Error: {error.message}</div>;
  if (!data) return <div>No Users Found</div>;

  return (
    <div className="h-full overflow-y-auto border-2 border-solid rounded-lg text-pretty">
      <h1>Users</h1>
      {data.map((users) => (
        <div key={users.id}>
          <div className="flex flex-row gap-4">
            <SwitchUserButton user_id={users.id ?? ""} />
            <div>
              Username: {users.username}
              {users.id === currentUserId?.value ? "(Current User)" : ""}
            </div>
            <div>Bio: {users.bio}</div>
          </div>
        </div>
      ))}

      {JSON.stringify(data)}
    </div>
  );
}
