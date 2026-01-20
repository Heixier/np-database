alter table "public"."likes" drop constraint "likes_message_id_fkey";

drop view if exists "public"."message_stats";

alter table "public"."likes" drop constraint "likes_pkey";

drop index if exists "public"."likes_pkey";


  create table "public"."comments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "post_id" uuid,
    "user_id" uuid,
    "content" text not null,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."posts" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "content" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."likes" drop column "message_id";

alter table "public"."likes" add column "post_id" uuid not null;

alter table "public"."messages" add column "recipient_id" uuid;

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (post_id, user_id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."likes" add constraint "likes_pkey" PRIMARY KEY using index "likes_pkey";

alter table "public"."comments" add constraint "comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_post_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."likes" add constraint "likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_post_id_fkey";

alter table "public"."messages" add constraint "messages_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_recipient_id_fkey";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

set check_function_bodies = off;

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
     JOIN public.notifications ON ((users.id = notifications.user_id)))
     JOIN public.messages ON ((users.id = messages.recipient_id)));


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
	select user_id into author_id from posts where id = NEW.post_id;
	select username into reviewer_name from users where id = NEW.user_id;
	-- now to notify the sender
	if author_id = NEW.user_id then
		notification_content := 'You liked your own post';
		notification_type := 'heartbreak'; -- because that's sad
	else
		notification_content := reviewer_name || ' liked one of your posts';
		notification_type := 'like';
	end if;
		
	insert into notifications (user_id, sender_id, "type", content)
	values (author_id, NEW.user_id, notification_type, notification_content);

	return NEW;
end;
$function$
;

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";


