import { cookies } from "next/headers";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";

export default async function Posts() {
  const { data: posts, error } = await fetchAllPosts();
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_id")?.value;

  if (error) return <div>Database error: {error.message}</div>;
  if (!posts) return <div>No posts to show</div>;

  return (
    <div className="h-full overflow-y-auto border-2 border-solid rounded-lg text-pretty">
      <h1>Posts</h1>
      <CreatePostButton user_id={currentUserId ?? ""} />
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title} by {post.users?.username}</h2>
          <p>Post contents: {post.content}</p>
          <h3>Comments:</h3>
          {post.comments?.map((comment) => (
            <div key={comment.id}>
              <p key={comment.id}>
                Commenter name: {comment.users?.username ?? "anon"}
              </p>
              <p>Comment: {comment.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
