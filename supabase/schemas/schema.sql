create extension if not exists "uuid-ossp";

create table users (
	id uuid primary key default uuid_generate_v4(),
	username text not null,
	bio text
);

create table posts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	content text not null,
	created_at timestamp with time zone default now()
);

create table comments (
	id uuid primary key default uuid_generate_v4(),
	post_id uuid references posts (id) on delete cascade,
	user_id uuid references users (id) on delete cascade,
	content text not null,
	created_at timestamp with time zone default now()
);

create table messages (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade, -- sender
	recipient_id uuid references users (id) on delete cascade,
	content text,
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

create table notifications (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid references users (id) on delete cascade,
	sender_id uuid references users (id) on delete cascade,
	"type" text not null,
	content text not null,
	"read" boolean default false,
	created_at timestamp with time zone default now() 
);

create view notifications_with_sender_name as
	select notifications.*, users.username as sender_name from notifications left join users on users.id = notifications.sender_id;

create view post_stats as
	select posts.*, users.username as username,
	(select count(*) from likes where post_id = posts.id) as like_count
from posts left join users on posts.user_id = users.id;

create or replace view user_stats as 
	select id, username, (select count(*) from follows where u.id = following_id) as follower_count,
	(select count(*) from follows where u.id = follower_id) as following_count,
	(select count(*) from notifications where u.id = user_id and "read" = false) as unread_notifications
from users u;

-- every time a new entry is added into likes, so NEW would be the new row in likes
-- what does likes have? message_id and user_id. The sender's user_id is inside messages.user_id
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