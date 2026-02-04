This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

npx supabase gen types typescript --local > ./types/supabase.ts
npx supabase gen types typescript --linked > ./types/supabase.ts

At some point I kinda gave up on local

npx supabase db diff -f add_tables && npx supabase db reset
npx supabase migration up --linked

Note if it's not refreshing automatically it might be Realtime getting disabled in the remote.
Every time I update the schema and reset the remote database, it resets the Realtime configuration as well.

No idea how to configure it remotely while still maintaining schema.sql portability (skill issue)
