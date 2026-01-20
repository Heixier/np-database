
  create table "public"."follows" (
    "follower_id" uuid not null,
    "following_id" uuid not null
      );



  create table "public"."likes" (
    "message_id" uuid not null,
    "user_id" uuid not null
      );



  create table "public"."messages" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "content" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."notifications" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "sender_id" uuid,
    "type" text not null,
    "content" text not null,
    "read" boolean default false,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."users" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "username" text not null,
    "bio" text
      );


CREATE UNIQUE INDEX follows_pkey ON public.follows USING btree (follower_id, following_id);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (message_id, user_id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."follows" add constraint "follows_pkey" PRIMARY KEY using index "follows_pkey";

alter table "public"."likes" add constraint "likes_pkey" PRIMARY KEY using index "likes_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."follows" add constraint "follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_follower_id_fkey";

alter table "public"."follows" add constraint "follows_following_id_fkey" FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_following_id_fkey";

alter table "public"."follows" add constraint "no_self_follow" CHECK ((follower_id <> following_id)) not valid;

alter table "public"."follows" validate constraint "no_self_follow";

alter table "public"."likes" add constraint "likes_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_message_id_fkey";

alter table "public"."likes" add constraint "likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_user_id_fkey";

alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_sender_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_follow_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
	follower_name text;
begin
	select username into follower_name from users where id = NEW.follower_id;

	insert into notifications (user_id, sender_id, "type", content)
	values (NEW.following_id, NEW.follower_id, 'new_follower', follower_name || ' is now following you');

	return NEW;
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
	notification_type text;
begin
	select user_id into author_id from messages where id = NEW.message_id;
	select username into reviewer_name from users where id = NEW.user_id;
	-- now to notify the sender
	if author_id = NEW.user_id then
		notification_content := 'You liked your own message';
		notification_type := 'heartbreak'; -- because that's sad
	else
		notification_content := reviewer_name || ' liked your message';
		notification_type := 'like';
	end if;
		
	insert into notifications (user_id, sender_id, "type", content)
	values (author_id, NEW.user_id, notification_type, notification_content);

	return NEW;
end;
$function$
;

create or replace view "public"."message_stats" as  SELECT messages.id,
    messages.user_id,
    messages.content,
    messages.created_at,
    users.username,
    ( SELECT count(*) AS count
           FROM public.likes
          WHERE (likes.message_id = messages.id)) AS like_count
   FROM (public.messages
     LEFT JOIN public.users ON ((messages.user_id = users.id)));


create or replace view "public"."notifications_for_display" as  SELECT notifications.id,
    notifications.user_id,
    notifications.sender_id,
    notifications.type,
    notifications.content,
    notifications.read,
    notifications.created_at,
    users.username,
    users.bio,
    users.username AS sender_username
   FROM (public.notifications
     LEFT JOIN public.users USING (id));


create or replace view "public"."user_stats" as  SELECT id,
    username,
    ( SELECT count(*) AS count
           FROM public.follows
          WHERE (u.id = follows.following_id)) AS follower_count,
    ( SELECT count(*) AS count
           FROM public.follows
          WHERE (u.id = follows.follower_id)) AS following_count,
    ( SELECT count(*) AS count
           FROM public.notifications
          WHERE ((u.id = notifications.user_id) AND (notifications.read = false))) AS unread_notifications
   FROM public.users u;


grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

grant delete on table "public"."likes" to "anon";

grant insert on table "public"."likes" to "anon";

grant references on table "public"."likes" to "anon";

grant select on table "public"."likes" to "anon";

grant trigger on table "public"."likes" to "anon";

grant truncate on table "public"."likes" to "anon";

grant update on table "public"."likes" to "anon";

grant delete on table "public"."likes" to "authenticated";

grant insert on table "public"."likes" to "authenticated";

grant references on table "public"."likes" to "authenticated";

grant select on table "public"."likes" to "authenticated";

grant trigger on table "public"."likes" to "authenticated";

grant truncate on table "public"."likes" to "authenticated";

grant update on table "public"."likes" to "authenticated";

grant delete on table "public"."likes" to "service_role";

grant insert on table "public"."likes" to "service_role";

grant references on table "public"."likes" to "service_role";

grant select on table "public"."likes" to "service_role";

grant trigger on table "public"."likes" to "service_role";

grant truncate on table "public"."likes" to "service_role";

grant update on table "public"."likes" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

CREATE TRIGGER trigger_follow_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();

CREATE TRIGGER trigger_like_notification AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_like_notification();


