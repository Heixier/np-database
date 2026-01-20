drop view if exists "public"."post_stats";

create or replace view "public"."posts_with_comments" as  SELECT posts.user_id AS author_id,
    posts.title,
    posts.content AS post_content,
    posts.created_at AS post_created_at,
    comments.user_id,
    comments.content AS comment_content,
    comments.created_at AS comment_created_at
   FROM (public.posts
     LEFT JOIN public.comments ON ((posts.id = comments.post_id)));


create or replace view "public"."post_stats" as  SELECT posts.id,
    posts.user_id,
    posts.title,
    posts.content,
    posts.created_at,
    users.username,
    ( SELECT count(*) AS count
           FROM public.likes
          WHERE (likes.post_id = posts.id)) AS like_count
   FROM (public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)));



