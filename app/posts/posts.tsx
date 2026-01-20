import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import { PostWithCommentsAndUsernames } from "@/types/extend";

export default async function Posts() {
  const { data, error } = await fetchAllPosts();

  if (error) return <div>Database error: {error.message}</div>;
  if (!data) return <div>No posts to show</div>;

  const posts = data as PostWithCommentsAndUsernames[];

  return (
    <div className="h-full overflow-y-auto border-2 border-solid rounded-lg text-pretty">
      <h1>Posts</h1>
      <CreatePostButton />
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>Post contents: {post.content}</p>
          <h3>Comments:</h3>
          {post.comments.map((comment) => (
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
