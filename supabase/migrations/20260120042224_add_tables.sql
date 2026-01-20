drop view if exists "public"."all_notifications_and_messages";

drop view if exists "public"."post_stats";

create or replace view "public"."post_stats" as  SELECT posts.id,
    posts.user_id,
    posts.content,
    posts.created_at,
    users.username,
    ( SELECT count(*) AS count
           FROM public.likes
          WHERE (likes.post_id = posts.id)) AS like_count
   FROM (public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)));



