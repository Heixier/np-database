create extension if not exists "uuid-ossp";

create type notification_type as enum (
	'like',
	'follow',
	'post'
);

create table users (
	id uuid primary key default uuid_generate_v4(),
	username text not null,
	bio text,
	follower_count numeric default 0 not null, -- denormalised for performance; handled by triggers
	unique(username)
);

alter table users
enable row level security;

create policy "Allow full access on users table"
on users
for all
to anon
using (true);


create table posts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade not null,
	title text not null,
	content text not null,
	like_count numeric default 0 not null,-- denormalised for performance; handled by triggers
	created_at timestamp with time zone default now() not null
);

alter table posts
enable row level security;

create policy "Allow full access on posts table"
on posts
for all
to anon
using (true);


create table chats (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	content text not null,
	created_at timestamp with time zone default now() not null
);

alter table chats
enable row level security;

create policy "Allow full access on chats table"
on chats
for all
to anon
using (true);


create table comments (
	id uuid primary key default uuid_generate_v4(),
	post_id uuid references posts (id) on delete cascade not null,
	user_id uuid references users (id) on delete cascade not null,
	content text not null,
	replying_to uuid references comments(id),
	created_at timestamp with time zone default now() not null
);

alter table comments
enable row level security;

create policy "Allow full access on comments table"
on comments
for all
to anon
using (true);


create table notifications (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade not null,
	sender_id uuid references users (id) on delete cascade,
	post_id uuid references posts (id) on delete cascade,
	"type" notification_type not null, -- custom user type ;-;
	content text not null,
	"read" boolean default false,
	created_at timestamp with time zone default now() 
);

alter table notifications
enable row level security;

create policy "Allow full access on notifications table"
on notifications
for all
to anon
using (true);


create table follows (
	follower_id uuid references users (id) on delete cascade not null,
	following_id uuid references users (id) on delete cascade not null,
	constraint no_self_follow check (follower_id != following_id), -- will be disabled in the UI but just in case
	primary key (follower_id, following_id)
);

alter table follows
enable row level security;

create policy "Allow full access on follows table"
on follows
for all
to anon
using (true);


create table likes (
	post_id uuid references posts (id) on delete cascade not null,
	user_id uuid references users (id) on delete cascade not null,
	primary key (post_id, user_id)
);

alter table likes
enable row level security;

create policy "Allow full access on likes table"
on likes
for all
to anon
using (true);

-- Frequently accessed indexes
create index idx_posts_user_id on posts(user_id);
create index idx_comments_post_id on comments(post_id);

create view notifications_with_sender_name as
	select notifications.*, 
	users.username 
	as sender_name 
	from notifications 
	left join users on users.id = notifications.sender_id;

create view post_view as
with like_counts as (
	select post_id, count(*) as likes from likes
	group by post_id
)
select posts.*, 
users.username as username, 
like_counts.likes as likes
from posts
left join users on posts.user_id = users.id
left join like_counts on posts.id = like_counts.post_id
order by created_at desc;

create or replace view user_view as
-- Table that holds all the user_ids of users who are followed + count for each
with follower_counts as (
	select following_id, count(*) as follower_count
	from follows
	group by following_id
),
-- Table that holds all the user_ids of users who are following (which one is creepier?)
following_counts as (
	select follower_id, count(*) as following_count
	from follows
	group by follower_id
),
notification_counts as (
	select user_id, count(*) as unread_notifications from notifications where read = false
	group by user_id
)
select
	users.id,
	users.bio,
	users.username,
	-- otherwise those with no followers end up with null which makes my frontend harder
	coalesce(follower_counts.follower_count, 0) as follower_count,
	coalesce(following_counts.following_count, 0) as following_count,
	coalesce(notification_counts.unread_notifications, 0) as unread_notifications
from users
left join follower_counts on users.id = follower_counts.following_id
left join following_counts on users.id = following_counts.follower_id
left join notification_counts on users.id = notification_counts.user_id;

-- every time a new entry is added into likes, so NEW would be the new row in likes
-- what does likes have? message_id and user_id. The sender's user_id is inside posts.user_id
create or replace function create_like_notification()
returns trigger language plpgsql as $$
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
		
	insert into notifications (user_id, post_id, sender_id, "type", content)
	values (author_id, new.post_id, new.user_id, notif_type, notification_content);

	return new;
end;
$$;

create or replace trigger trigger_like_notification
	after insert on likes
	for each row
	execute function create_like_notification();


-- On deleting a row from likes
create or replace function delete_like_notification()
returns trigger language plpgsql as $$
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
$$;

create or replace trigger trigger_delete_like_notification
	after delete on likes
	for each row
	execute function delete_like_notification();


create or replace function create_follow_notification()
returns trigger language plpgsql as $$
declare
	follower_name text;
begin
	select username into follower_name from users where id = new.follower_id;

	insert into notifications (user_id, sender_id, "type", content)
	values (new.following_id, new.follower_id, 'follow', follower_name || ' is now following you');

	return new;
end;
$$;

create or replace trigger trigger_follow_notification
	after insert on follows
	for each row
	execute function create_follow_notification();

create or replace function delete_follow_notification()
returns trigger language plpgsql as $$
begin
	delete from notifications
	where user_id = old.following_id
	and sender_id = old.follower_id
	and "type" = 'follow';

	return old;
end;
$$;

create or replace trigger trigger_delete_follow_notification
	after delete on follows
	for each row
	execute function delete_follow_notification();


create or replace function create_post_notification()
returns trigger language plpgsql as $$
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
	'New post from ' || post_author_name
	from follows
	where new.user_id = following_id;

	return new;
end;
$$;

create or replace trigger trigger_create_post_notification
	after insert on posts
	for each row
	execute function create_post_notification();

-- On delete cascade will handle the deleting post notification thank god

create or replace function decrement_like_count()
returns trigger language plpgsql as $$
begin
	update posts
	set like_count = like_count - 1
	where posts.id = old.post_id
	and like_count > 0;

	return old; 
end
$$;

create or replace trigger trigger_decrement_like_count
	after delete on likes
	for each row
	execute function decrement_like_count();

create or replace function increment_like_count()
returns trigger language plpgsql as $$
begin
	update posts
	set like_count = like_count + 1
	where posts.id = new.post_id;

	return new;
end
$$;

create or replace trigger trigger_increment_like_count
	after insert on likes
	for each row
	execute function increment_like_count();

create or replace function decrement_follower_count()
returns trigger language plpgsql as $$
begin
	update users
	set follower_count = follower_count - 1
	where users.id = old.following_id
	and follower_count > 0;

	return old;
end
$$;

create or replace trigger trigger_decrement_follower_count
	after delete on follows
	for each row
	execute function decrement_follower_count();

create or replace function increment_follower_count()
returns trigger language plpgsql as $$
begin
	update users
	set follower_count = follower_count + 1
	where users.id = new.following_id;

	return new;
end
$$;

create or replace trigger trigger_increment_follower_count
	after insert on follows
	for each row
	execute function increment_follower_count();