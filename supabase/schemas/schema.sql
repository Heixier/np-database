create extension if not exists "uuid-ossp";

create type notification_type as enum (
	'like',
	'follow',
	'heartbreak'
);

create table users (
	id uuid primary key default uuid_generate_v4(),
	username text not null,
	bio text
);

create table posts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	title text not null,
	content text not null,
	created_at timestamp with time zone default now() not null
);

create table chats (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	content text not null,
	created_at timestamp with time zone default now() not null
);

create table comments (
	id uuid primary key default uuid_generate_v4(),
	post_id uuid references posts (id) on delete cascade,
	user_id uuid references users (id) on delete cascade,
	content text not null,
	replying_to uuid references comments(id),
	created_at timestamp with time zone default now() not null
);

create table notifications (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	sender_id uuid references users (id) on delete cascade,
	"type" notification_type not null,
	content text not null,
	"read" boolean default false,
	created_at timestamp with time zone default now() 
);

create table follows (
	follower_id uuid references users (id) on delete cascade,
	following_id uuid references users (id) on delete cascade,
	constraint no_self_follow check (follower_id != following_id), -- will be disabled in the UI but just in case
	primary key (follower_id, following_id)
);

create table likes (
	post_id uuid references posts (id) on delete cascade,
	user_id uuid references users (id) on delete cascade,
	primary key (post_id, user_id)
);

-- Frequently accessed indexes
create index idx_posts_user_id on posts(user_id);
create index idx_comments_post_id on comments(post_id);

create view notifications_with_sender_name as
	select notifications.*, users.username as sender_name from notifications left join users on users.id = notifications.sender_id;

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
$$;

create or replace trigger trigger_like_notification
	after insert on likes
	for each row
	execute function create_like_notification();

create or replace function create_follow_notification()
returns trigger language plpgsql as $$
declare
	follower_name text;
begin
	select username into follower_name from users where id = NEW.follower_id;

	insert into notifications (user_id, sender_id, "type", content)
	values (NEW.following_id, NEW.follower_id, 'new_follower', follower_name || ' is now following you');

	return NEW;
end;
$$;

create or replace trigger trigger_follow_notification
	after insert on follows
	for each row
	execute function create_follow_notification();

create or replace function follower_count(users) returns bigint language sql as $$
	select count(*) from follows where $1.id = following_id;
$$;

create or replace function post_like_count(posts) returns bigint language sql as $$
	select count(*) from likes where $1.id = post_id;
$$;