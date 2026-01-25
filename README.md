This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

npx supabase gen types typescript --local > ./types/supabase.ts

npx supabase db diff -f add_tables && npx supabase db reset
