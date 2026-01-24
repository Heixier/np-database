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
	values (NEW.following_id, NEW.follower_id, 'follow', follower_name || ' is now following you');

	return NEW;
end;
$function$
;


