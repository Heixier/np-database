drop view if exists "public"."post_view";

alter table "public"."chats" alter column "created_at" set not null;

alter table "public"."comments" alter column "created_at" set not null;

alter table "public"."posts" alter column "created_at" set not null;

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
    users.username,
    like_counts.likes
   FROM ((public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)))
     LEFT JOIN like_counts ON ((posts.id = like_counts.post_id)))
  ORDER BY posts.created_at DESC;



