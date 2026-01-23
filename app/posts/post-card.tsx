import { PostWithCommentsAndUsernames } from "@/types/extend";

export default function PostCard(posts: PostWithCommentsAndUsernames[]) {
  {
    posts.map((post) => (
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
    ));
  }
}
