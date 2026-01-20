drop view if exists "public"."user_stats";

drop view if exists "public"."post_stats";

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



