drop view if exists "public"."notifications_with_sender_name";

drop view if exists "public"."user_view";

alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('like', 'follow', 'post');

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."notification_type__old_version_to_be_dropped";

alter table "public"."notifications" add column "post_id" uuid;

alter table "public"."notifications" add constraint "notifications_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_post_id_fkey";

set check_function_bodies = off;

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
		"type", 
		content)
	select
	follower_id,
	following_id,
	'post',
	'New post from ' || post_author_name
	from follows
	where new.user_id = following_id;

	return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_follow_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	delete from notifications
	where user_id = following_id
	and sender_id = follower_id
	and "type" = 'follow';

	return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_like_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	post_author_id uuid;
begin
	select user_id into post_author_id from posts where posts.id = old.post_id;

	delete from notifications
	where user_id = post_author_id
	and sender_id = old.user_id
	and post_id = old.post_id
	and "type" = 'like';

	return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_follow_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	follower_name text;
begin
	select username into follower_name from users where id = new.follower_id;

	insert into notifications (user_id, sender_id, "type", content)
	values (new.following_id, new.follower_id, 'follow', follower_name || ' is now following you');

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
		notification_content := reviewer_name || ' liked one of your posts';
		notif_type := 'like';
	end if;
		
	insert into notifications (user_id, sender_id, "type", content)
	values (author_id, new.user_id, notif_type, notification_content);

	return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.decrement_follower_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	update users
	set follower_count = follower_count - 1
	where users.id = old.following_id
	and follower_count > 0;

	return old;
end
$function$
;

CREATE OR REPLACE FUNCTION public.decrement_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	update posts
	set like_count = like_count - 1
	where posts.id = old.post_id
	and like_count > 0;

	return old; 
end
$function$
;

CREATE OR REPLACE FUNCTION public.increment_follower_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	update users
	set follower_count = follower_count + 1
	where users.id = new.following_id;

	return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.increment_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	update posts
	set like_count = like_count + 1
	where posts.id = new.post_id;

	return new;
end
$function$
;

create or replace view "public"."notifications_with_sender_name" as  SELECT notifications.id,
    notifications.user_id,
    notifications.sender_id,
    notifications.post_id,
    notifications.type,
    notifications.content,
    notifications.read,
    notifications.created_at,
    users.username AS sender_name
   FROM (public.notifications
     LEFT JOIN public.users ON ((users.id = notifications.sender_id)));


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
    users.bio,
    users.username,
    COALESCE(follower_counts.follower_count, (0)::bigint) AS follower_count,
    COALESCE(following_counts.following_count, (0)::bigint) AS following_count,
    COALESCE(notification_counts.unread_notifications, (0)::bigint) AS unread_notifications
   FROM (((public.users
     LEFT JOIN follower_counts ON ((users.id = follower_counts.following_id)))
     LEFT JOIN following_counts ON ((users.id = following_counts.follower_id)))
     LEFT JOIN notification_counts ON ((users.id = notification_counts.user_id)));


CREATE TRIGGER trigger_delete_follow_notification AFTER DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.delete_follow_notification();

CREATE TRIGGER trigger_delete_like_notification AFTER DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.delete_like_notification();

CREATE TRIGGER trigger_create_post_notification AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.create_post_notification();


