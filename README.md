This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

npx supabase gen types typescript --local > ./types/supabase.ts
npx supabase gen types typescript --linked > ./types/supabase.ts

At some point I kinda gave up on local

npx supabase db diff -f add_tables && npx supabase db reset
npx supabase migration up --linked

Realtime was originally implemented but I decided it wasn't going to be used too much by multiple users
