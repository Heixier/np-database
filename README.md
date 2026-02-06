This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



```npm install```
```npm run dev```



For my own copy and paste reference below:
```
npx supabase gen types typescript --linked > ./types/supabase.ts
npx supabase db diff -f change
npx supabase migration up --linked
```

Realtime was originally implemented but I decided it wasn't going to be used too much by multiple users
