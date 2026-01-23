drop view if exists "public"."post_view";

create or replace view "public"."post_view" as  WITH like_counts AS (
         SELECT likes.post_id,
            count(*) AS count
           FROM public.likes likes
          GROUP BY likes.post_id
        )
 SELECT posts.id,
    posts.user_id,
    posts.title,
    posts.content,
    posts.created_at,
    users.username
   FROM ((public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)))
     LEFT JOIN like_counts ON ((posts.id = like_counts.post_id)));



