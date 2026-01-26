alter table "public"."chats" enable row level security;

alter table "public"."comments" enable row level security;

alter table "public"."follows" enable row level security;

alter table "public"."likes" enable row level security;

alter table "public"."notifications" enable row level security;

alter table "public"."posts" enable row level security;

alter table "public"."users" enable row level security;


  create policy "Allow full access on chats table"
  on "public"."chats"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on comments table"
  on "public"."comments"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on follows table"
  on "public"."follows"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on likes table"
  on "public"."likes"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on notifications table"
  on "public"."notifications"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on posts table"
  on "public"."posts"
  as permissive
  for all
  to anon
using (true);



  create policy "Allow full access on users table"
  on "public"."users"
  as permissive
  for all
  to anon
using (true);



