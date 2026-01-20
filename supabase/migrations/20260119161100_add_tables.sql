drop view if exists "public"."all_notifications_and_messages";

drop view if exists "public"."post_stats";

create or replace view "public"."all_notifications_and_messages" as  SELECT notifications.id,
    notifications.user_id,
    notifications.sender_id,
    notifications.type,
    notifications.content,
    notifications.read,
    notifications.created_at,
    messages.content AS message_content,
    messages.created_at AS message_created_at,
    ( SELECT users_1.username
           FROM public.users users_1
          WHERE (messages.user_id = users_1.id)) AS sender_name,
    users.username
   FROM ((public.users
     LEFT JOIN public.notifications ON ((users.id = notifications.user_id)))
     LEFT JOIN public.messages ON ((users.id = messages.recipient_id)));


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



