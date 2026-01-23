drop view if exists "public"."post_stats";

alter table "public"."comments" add column "replying_to" uuid;

CREATE INDEX idx_comments_post_id ON public.comments USING btree (post_id);

CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);

alter table "public"."comments" add constraint "comments_replying_to_fkey" FOREIGN KEY (replying_to) REFERENCES public.comments(id) not valid;

alter table "public"."comments" validate constraint "comments_replying_to_fkey";

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



