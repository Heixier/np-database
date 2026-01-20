drop view if exists "public"."post_stats";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.follower_count(public.users)
 RETURNS bigint
 LANGUAGE sql
AS $function$
	select count(*) from follows where $1.id = following_id;
$function$
;

CREATE OR REPLACE FUNCTION public.post_like_count(public.posts)
 RETURNS bigint
 LANGUAGE sql
AS $function$
	select count(*) from likes where $1.id = post_id;
$function$
;

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



