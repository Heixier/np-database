drop view if exists "public"."post_view";

create or replace view "public"."post_view" as  WITH like_counts AS (
         SELECT likes.post_id,
            count(*) AS likes
           FROM public.likes
          GROUP BY likes.post_id
        )
 SELECT posts.id,
    posts.user_id,
    posts.title,
    posts.content,
    posts.created_at,
    comments.user_id AS commenter,
    comments.content AS comment_content,
    comments.replying_to,
    comments.created_at AS comment_created_at,
    users.username,
    like_counts.likes
   FROM (((public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)))
     LEFT JOIN like_counts ON ((posts.id = like_counts.post_id)))
     LEFT JOIN public.comments ON ((posts.id = comments.post_id)))
  ORDER BY posts.created_at DESC;



