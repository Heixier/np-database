import { json } from "stream/consumers";
import { stringify } from "querystring";
import { fetchAllUsers } from "./fetch";

export default async function Users() {
  const { data, error } = await fetchAllUsers();

  if (error) return <div>Database Error: {error.message}</div>;
  if (!data) return <div>No Users Found</div>;

  return (
    <div className="h-full overflow-y-auto border-2 border-solid rounded-lg text-pretty">
      <h1>Users</h1>
      {JSON.stringify(data)}
    </div>
  );
}
