drop view if exists "public"."notifications_with_sender_details";

drop view if exists "public"."post_view";

drop view if exists "public"."user_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_follow_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	follower_name text;
begin
	select username into follower_name from users where id = new.follower_id;

	insert into notifications (user_id, sender_id, "type", content)
	values (new.following_id, new.follower_id, 'follow', '@' || follower_name || ' is now following you');

	return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_like_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	author_id uuid;
	reviewer_name text;
	notification_content text;
	notif_type notification_type;
begin
	select user_id into author_id from posts where id = new.post_id;
	select username into reviewer_name from users where id = new.user_id;
	-- now to notify the sender
	if author_id != new.user_id then
		notification_content := '@' || reviewer_name || ' liked one of your posts';
		notif_type := 'like';
	end if;
		
	insert into notifications (user_id, post_id, sender_id, "type", content)
	values (author_id, new.post_id, new.user_id, notif_type, notification_content);

	return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	post_author_name text;
begin
	select username into post_author_name from users where id = new.user_id;

	insert into notifications (
		user_id, 
		sender_id,
		post_id, 
		"type", 
		content)
	select
	follower_id,
	following_id,
	new.id,
	'post',
	'New post from @' || post_author_name
	from follows
	where new.user_id = following_id;

	return new;
end;
$function$
;

create or replace view "public"."notifications_with_sender_details" as  SELECT notifications.id,
    notifications.user_id,
    notifications.sender_id,
    notifications.post_id,
    notifications.type,
    notifications.content,
    notifications.read,
    notifications.created_at,
    users.username AS sender_name,
    users.media_url AS sender_media_url
   FROM (public.notifications
     LEFT JOIN public.users ON ((users.id = notifications.sender_id)));


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
    posts.like_count,
    posts.created_at,
    users.username,
    like_counts.likes
   FROM ((public.posts
     LEFT JOIN public.users ON ((posts.user_id = users.id)))
     LEFT JOIN like_counts ON ((posts.id = like_counts.post_id)))
  ORDER BY posts.created_at DESC;


create or replace view "public"."user_view" as  WITH follower_counts AS (
         SELECT follows.following_id,
            count(*) AS follower_count
           FROM public.follows
          GROUP BY follows.following_id
        ), following_counts AS (
         SELECT follows.follower_id,
            count(*) AS following_count
           FROM public.follows
          GROUP BY follows.follower_id
        ), notification_counts AS (
         SELECT notifications.user_id,
            count(*) AS unread_notifications
           FROM public.notifications
          WHERE (notifications.read = false)
          GROUP BY notifications.user_id
        )
 SELECT users.id,
    users.username,
    users.bio,
    users.media_url,
    COALESCE(follower_counts.follower_count, (0)::bigint) AS follower_count,
    COALESCE(following_counts.following_count, (0)::bigint) AS following_count,
    COALESCE(notification_counts.unread_notifications, (0)::bigint) AS unread_notifications
   FROM (((public.users
     LEFT JOIN follower_counts ON ((users.id = follower_counts.following_id)))
     LEFT JOIN following_counts ON ((users.id = following_counts.follower_id)))
     LEFT JOIN notification_counts ON ((users.id = notification_counts.user_id)));



