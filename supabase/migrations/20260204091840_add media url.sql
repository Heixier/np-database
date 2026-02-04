drop view if exists "public"."notifications_with_sender_name";

drop view if exists "public"."post_view";

drop view if exists "public"."user_view";

alter table "public"."users" add column "media_url" text;

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
    users.bio,
    users.username,
    COALESCE(follower_counts.follower_count, (0)::bigint) AS follower_count,
    COALESCE(following_counts.following_count, (0)::bigint) AS following_count,
    COALESCE(notification_counts.unread_notifications, (0)::bigint) AS unread_notifications
   FROM (((public.users
     LEFT JOIN follower_counts ON ((users.id = follower_counts.following_id)))
     LEFT JOIN following_counts ON ((users.id = following_counts.follower_id)))
     LEFT JOIN notification_counts ON ((users.id = notification_counts.user_id)));



