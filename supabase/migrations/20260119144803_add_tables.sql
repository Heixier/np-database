create or replace view "public"."notifications_for_display" as  SELECT notifications.id,
    notifications.user_id,
    notifications.sender_id,
    notifications.type,
    notifications.content,
    notifications.read,
    notifications.created_at,
    users.username AS sender_username
   FROM (public.notifications
     LEFT JOIN public.users ON ((users.id = notifications.user_id)));



